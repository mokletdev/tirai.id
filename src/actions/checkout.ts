"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { formatPhoneNumber, generateInvoiceNumber } from "@/lib/utils";
import { CartItem, CustomRequestItem } from "@/types/cart";
import { CreateInvoiceSuccessResponse, ItemDetail } from "@/types/midtrans";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { calculateCartWeight } from "@/utils/calculate-cart-weight";
import { getCostByCourierCode } from "@/utils/couriers";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { Role } from "@prisma/client";
import { addDays, addMinutes } from "date-fns";
import { updateCart } from "./cart";
import { createTransactionInvoice } from "./midtrans";
import { Service } from "./shippingPrice/scraper";

interface CartObject {
  cartItems?: CartItem[];
  customRequest?: CustomRequestItem;
}

const handleStandardCheckout = async (
  cartItems: CartItem[],
  shipmentAddressId: string,
  courier: Service,
  userId: string,
  userRole: Role,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  const itemIds = cartItems.map((item) => item.productId);

  const [discount, products, shipmentAddress] = await Promise.all([
    findDiscountByRole(userRole),
    prisma.product.findMany({
      where: { id: { in: itemIds } },
      include: { variants: true },
    }),
    prisma.shippingAddress.findUnique({ where: { id: shipmentAddressId } }),
  ]);

  if (!shipmentAddress) {
    return ActionResponses.notFound("Alamat pengiriman tidak ditemukan!");
  }

  const shipmentCost = await getCostByCourierCode({
    courierCode: courier.code,
    service: courier.service,
    originCity: process.env.NEXT_PUBLIC_ORIGIN_CITY as string,
    destinationCity:
      shipmentAddress.city.split(" ").length > 1
        ? shipmentAddress.city.split(" ")[1]
        : shipmentAddress.city,
    weightInKg: calculateCartWeight(products, cartItems),
  });

  if (!shipmentCost) {
    return ActionResponses.serverError();
  }

  return await prisma.$transaction(async (tx) => {
    // Validate stock atomically
    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      const variant = item.variantId
        ? product?.variants.find((v) => v.id === item.variantId)
        : undefined;

      const availableStock = variant ? variant.stock : product?.stock;
      if (!availableStock || item.quantity > availableStock) {
        return ActionResponses.error({
          code: "CONFLICT",
          message: `Stok tidak mencukupi untuk ${item.name}. Diminta: ${item.quantity}. Tersedia: ${availableStock}`,
        });
      }
    }

    // Create the order
    const order = await tx.order.create({
      data: {
        shipping_address: buildShipmentAddressString(shipmentAddress),
        status: "UNPAID",
        user_id: userId,
        shipping_price: shipmentCost,
        phone_number: formatPhoneNumber(shipmentAddress.recipient_phone_number),
        total_price: 0,
      },
    });

    await tx.shipment.create({
      data: {
        carrier: courier.code,
        estimated_finish_time: addDays(new Date(), 5),
        status: "PENDING",
        order_id: order.id,
      },
    });

    let amount = 0;
    let vat = 0;
    const itemDetails: ItemDetail[] = [];

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      const variant = item.variantId
        ? product?.variants.find((v) => v.id === item.variantId)
        : undefined;

      const totalItemPrice =
        item.quantity * (variant ? variant.price : (product?.price ?? 0));

      amount += totalItemPrice;

      if (product?.is_vat) {
        const discountItemPrice =
          (totalItemPrice * (discount?.discount_in_percent ?? 0)) / 100;
        vat += (totalItemPrice - discountItemPrice) * 0.11;
      }

      itemDetails.push({
        description: product!.name,
        price: variant ? variant.price : product!.price!,
        quantity: item.quantity,
      });

      if (variant) {
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: product?.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    const discountPrice = (amount * (discount?.discount_in_percent ?? 0)) / 100;

    await tx.order.update({
      where: { id: order.id },
      data: { total_price: amount - discountPrice + shipmentCost + vat },
    });

    const result = await createTransactionInvoice({
      customer_details: {
        name: shipmentAddress.recipient_name,
        id: userId,
        phone: formatPhoneNumber(shipmentAddress.recipient_phone_number),
      },
      payment_link: {
        enabled_payments: [
          "bca_va",
          "gopay",
          "permata_va",
          "echannel",
          "other_qris",
        ],
      },
      order_id: order.id,
      due_date: addMinutes(new Date(), 10).toISOString(),
      invoice_date: new Date().toISOString(),
      invoice_number: generateInvoiceNumber(),
      item_details: itemDetails,
      payment_type: "payment_link",
      amount: {
        vat: vat.toString(),
        discount: discountPrice.toString(),
        shipping: shipmentCost.toString(),
      },
    });

    if (!result.success || result.error || !result.data) {
      console.log(result.error);
      return ActionResponses.serverError();
    }

    await tx.order.update({
      where: { id: order.id },
      data: { invoice_link: result.data.pdf_url },
    });

    await tx.payment.create({
      data: {
        order_id: order.id,
        status: "PENDING",
        transaction_id: result.data.id,
      },
    });

    await updateCart({ type: "ready-stock", items: [] });

    return ActionResponses.success(result.data);
  });
};

const handleCustomRequestCheckout = async (
  customRequestItem: CustomRequestItem,
  userId: string,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  try {
    // Fetch the custom request and validate its existence and shipping details
    const customRequest = await prisma.customRequest.findUnique({
      where: { id: customRequestItem.id },
    });

    if (
      !customRequest ||
      !customRequest.shipping_price ||
      !customRequest.carrier_code
    ) {
      return ActionResponses.serverError("Order has not been approved!");
    }

    // Fetch the user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return ActionResponses.serverError("User not found!");
    }

    // Calculate VAT if applicable
    const vat = customRequest.is_vat ? (customRequest.price * 11) / 100 : 0;

    // Create an order entry
    const totalPrice = customRequest.shipping_price + customRequest.price + vat;
    const order = await prisma.order.create({
      data: {
        shipping_address: customRequest.address,
        status: "UNPAID",
        user_id: userId,
        phone_number: customRequest.recipient_phone_number,
        total_price: totalPrice,
        shipping_price: customRequest.shipping_price,
      },
    });

    // Create a shipment entry
    await prisma.shipment.create({
      data: {
        carrier: customRequest.carrier_code,
        estimated_finish_time: addDays(new Date(), 5),
        status: "PENDING",
        order_id: order.id,
      },
    });

    // Prepare item details for the invoice
    const itemDetails: ItemDetail[] = [
      {
        description: `${customRequest.model} ${customRequest.material} ${customRequest.color} (Custom Product)`,
        price: customRequest.price,
        quantity: 1,
      },
    ];

    // Create an order item entry
    await prisma.orderItem.create({
      data: {
        quantity: 1,
        custom_request_id: customRequest.id,
        order_id: order.id,
      },
    });

    // Generate the transaction invoice
    const result = await createTransactionInvoice({
      customer_details: {
        email: user.email,
        name: customRequest.recipient_name,
        id: user.id,
        phone: formatPhoneNumber(customRequest.recipient_phone_number),
      },
      payment_link: {
        enabled_payments: [
          "bca_va",
          "gopay",
          "permata_va",
          "echannel",
          "other_qris",
        ],
      },
      order_id: order.id,
      due_date: addMinutes(new Date(), 10).toISOString(),
      invoice_date: new Date().toISOString(),
      invoice_number: generateInvoiceNumber(),
      item_details: itemDetails,
      payment_type: "payment_link",
      amount: {
        vat: vat.toString(),
        discount: "0",
        shipping: customRequest.shipping_price.toString(),
      },
    });

    if (!result.success || result.error || !result.data) {
      return ActionResponses.serverError(
        "Failed to create transaction invoice.",
      );
    }

    // Update the order with the invoice link
    await prisma.order.update({
      where: { id: order.id },
      data: { invoice_link: result.data.pdf_url },
    });

    // Record the payment details
    await prisma.payment.create({
      data: {
        order_id: order.id,
        status: "PENDING",
        transaction_id: result.data.id,
      },
    });

    // Clear the user's cart
    await updateCart({ type: "ready-stock", items: [] });

    return ActionResponses.success(result.data);
  } catch (error) {
    console.error("Error in handleCustomRequestCheckout:", error);
    return ActionResponses.serverError("An unexpected error occurred.");
  }
};

export const upsertCheckout = async (
  cart: CartObject,
  shipmentAddressId?: string,
  courier?: Service,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  const session = await getServerSession();
  if (!session?.user) return ActionResponses.unauthorized();

  if (cart.cartItems && shipmentAddressId && courier) {
    return await handleStandardCheckout(
      cart.cartItems,
      shipmentAddressId,
      courier,
      session.user.id,
      session.user.role,
    );
  }

  if (cart.customRequest) {
    return await handleCustomRequestCheckout(
      cart.customRequest,
      session.user.id,
    );
  }

  return ActionResponses.badRequest("Invalid cart data.");
};
