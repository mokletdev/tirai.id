"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { CartObject } from "@/types/cart";
import { Courier } from "@/types/courier";
import { CreateInvoiceSuccessResponse, ItemDetail } from "@/types/midtrans";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { calculateCartWeight } from "@/utils/calculate-cart-weight";
import { getCostByCourierCode } from "@/utils/couriers";
import { generateToken } from "@/utils/random-string";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { addDays, addMinutes } from "date-fns";
import { updateCart } from "./cart";
import { createTransactionInvoice } from "./midtrans";

// Helper Functions
const formatPhoneNumber = (phone?: string) => {
  if (!phone) return phone;
  return phone.startsWith("0") ? phone.slice(1) : phone;
};

const generateInvoiceNumber = () => {
  const prefix = process.env.APP_ENV === "production" ? "TRX" : "DEV";
  return `${prefix}-${generateToken(12)}`;
};

const handleStandardCheckout = async (
  prisma: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  cart: CartObject,
  userId: string,
  shipmentAddressId: string,
  courier: Courier,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  // Step 1: Fetch necessary data
  const [user, products, shipmentAddress] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.product.findMany({
      where: { id: { in: cart.cartItems!.map((i) => i.productId) } },
      include: { variants: true },
    }),
    prisma.shippingAddress.findUnique({
      where: { id: shipmentAddressId },
    }),
  ]);

  if (!shipmentAddress) {
    return ActionResponses.notFound("Alamat pengiriman tidak ditemukan!");
  }

  // Step 2: Calculate shipping cost
  const destinationCity =
    shipmentAddress.city.split(" ").length > 1
      ? shipmentAddress.city.split(" ")[1]
      : shipmentAddress.city;

  const shipmentCost = await getCostByCourierCode({
    courierCode: courier.code,
    service: courier.service,
    originCity: process.env.NEXT_PUBLIC_ORIGIN_CITY as string,
    destinationCity,
    weightInKg: calculateCartWeight(products, cart.cartItems!),
  });

  if (!shipmentCost) {
    return ActionResponses.serverError();
  }

  // Step 3: Create order
  const order = await prisma.order.create({
    data: {
      shipping_address: buildShipmentAddressString(shipmentAddress),
      status: "UNPAID",
      user_id: userId,
      shipping_price: shipmentCost,
      phone_number: shipmentAddress.recipient_phone_number,
      total_price: 0,
    },
  });

  // Step 4: Create shipment
  await prisma.shipment.create({
    data: {
      carrier: courier.code,
      estimated_finish_time: addDays(new Date(), 5),
      status: "PENDING",
      order_id: order.id,
    },
  });

  // Step 5: Process order items and update stock
  let totalAmount = 0;
  const itemDetails: ItemDetail[] = [];

  // Create order items one by one to maintain consistency
  for (const item of cart.cartItems!) {
    const product = products.find((p) => item.productId === p.id)!;
    const variant = item.variantId
      ? product.variants.find((v) => item.variantId === v.id)
      : null;

    const price = variant ? variant.price : product.price!;
    totalAmount += item.quantity * price;

    itemDetails.push({
      description: product.name,
      price,
      quantity: item.quantity,
    });

    // Create order item
    await prisma.orderItem.create({
      data: {
        order_id: order.id,
        ...(variant ? { variant_id: variant.id } : { product_id: product.id }),
        quantity: item.quantity,
      },
    });

    // Update stock
    if (variant) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { stock: { decrement: item.quantity } },
      });
    } else {
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  // Step 6: Update order total
  await prisma.order.update({
    where: { id: order.id },
    data: { total_price: totalAmount + shipmentCost },
  });

  // Step 7: Create invoice
  const result = await createTransactionInvoice({
    customer_details: {
      email: user?.email,
      name: shipmentAddress.recipient_name,
      id: user?.id,
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
      vat: "0",
      discount: "0",
      shipping: shipmentCost.toString(),
    },
  });

  if (!result.success || result.error || !result.data) {
    return ActionResponses.serverError();
  }

  // Step 8: Update order with invoice and create payment record
  await prisma.order.update({
    where: { id: order.id },
    data: { invoice_link: result.data.pdf_url },
  });

  await prisma.payment.create({
    data: {
      order_id: order.id,
      status: "PENDING",
      transaction_id: result.data.id,
    },
  });

  await updateCart({ type: "ready-stock", items: [] });

  return ActionResponses.success(result.data);
};

const handleCustomCheckout = async (
  prisma: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  cart: CartObject,
  userId: string,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  // Step 1: Fetch necessary data
  const [customRequest, user] = await Promise.all([
    prisma.customRequest.findUnique({
      where: { id: cart.customRequest!.id },
    }),
    prisma.user.findUnique({
      where: { id: userId },
    }),
  ]);

  if (
    !customRequest?.shipping_price ||
    !customRequest.carrier_code ||
    !customRequest
  ) {
    return ActionResponses.serverError("Order has not been approved!");
  }

  // Step 2: Create order
  const order = await prisma.order.create({
    data: {
      shipping_address: customRequest.address,
      status: "UNPAID",
      user_id: userId,
      phone_number: customRequest.recipient_phone_number,
      total_price: customRequest.shipping_price + customRequest.price,
      shipping_price: customRequest.shipping_price,
    },
  });

  // Step 3: Create shipment and order item
  await prisma.shipment.create({
    data: {
      carrier: customRequest.carrier_code,
      estimated_finish_time: addDays(new Date(), 5),
      status: "PENDING",
      order_id: order.id,
    },
  });

  await prisma.orderItem.create({
    data: {
      quantity: 1,
      custom_request_id: customRequest.id,
      order_id: order.id,
    },
  });

  // Step 4: Create invoice
  const result = await createTransactionInvoice({
    customer_details: {
      email: user?.email,
      name: customRequest.recipient_name,
      id: user?.id,
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
    item_details: [
      {
        description: `${customRequest.model} ${customRequest.material} ${customRequest.color} (Custom Product)`,
        price: customRequest.price,
        quantity: 1,
      },
    ],
    payment_type: "payment_link",
    amount: {
      vat: "0",
      discount: "0",
      shipping: customRequest.shipping_price.toString(),
    },
  });

  if (!result.success || result.error || !result.data) {
    return ActionResponses.serverError();
  }

  // Step 5: Update order with invoice and create payment record
  await prisma.order.update({
    where: { id: order.id },
    data: { invoice_link: result.data.pdf_url },
  });

  await prisma.payment.create({
    data: {
      order_id: order.id,
      status: "PENDING",
      transaction_id: result.data.id,
    },
  });

  await updateCart({ type: "custom", item: undefined });

  return ActionResponses.success(result.data);
};

export const upsertCheckout = async (
  cart: CartObject,
  shipmentAddressId?: string,
  courier?: Courier,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  const session = await getServerSession();

  if (!session?.user) {
    return ActionResponses.unauthorized();
  }

  return prisma.$transaction(
    async (prisma) => {
      if (cart.cartItems && shipmentAddressId && courier) {
        return handleStandardCheckout(
          prisma,
          cart,
          session.user!.id,
          shipmentAddressId,
          courier,
        );
      }

      if (cart.customRequest) {
        return handleCustomCheckout(prisma, cart, session.user!.id);
      }

      return ActionResponses.badRequest("Need order item/custom order!");
    },
    {
      isolationLevel: "Serializable",
      timeout: 20000,
    },
  );
};
