"use client";

import { Button } from "@/components/ui/button";
import { Body3, H3 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { useEffect, useState, useMemo } from "react";

export const Details = ({
  products,
  checkoutDisabled,
  handleCheckout,
}: {
  products: ProductWithVariant[];
  checkoutDisabled: boolean;
  handleCheckout: () => void;
}) => {
  const { cart } = useCart();
  const [totalPrice, setTotal] = useState<number>(0);
  const [productPrice, setProductPrice] = useState<number>(0);
  const [shippingPrice, setShippingPrice] = useState<number>(0);

  const calculatedProductPrice = useMemo(() => {
    let price = 0;
    if (cart) {
      cart.forEach((i) => {
        const product =
          products[products.findIndex((j) => j.id === i.productId)];
        if (!product.price && i.variantId) {
          const variant =
            product.variants[
              product.variants.findIndex((j) => j.id === i.variantId)
            ];
          price += i.quantity * (variant.price || 0);
        } else {
          price += i.quantity * (product.price || 0);
        }
      });
    }
    return price;
  }, [cart, products]);

  useEffect(() => {
    setProductPrice(calculatedProductPrice);
    setTotal(calculatedProductPrice + shippingPrice); // Assuming totalPrice includes productPrice + shippingPrice
  }, [calculatedProductPrice, shippingPrice]);

  return (
    <div className="flex h-full w-1/4 flex-col items-stretch overflow-y-hidden">
      <div className="flex flex-row justify-between">
        <Body3 className="text-black">Subtotal</Body3>
        <Body3 className="text-black">IDR {productPrice}</Body3>
      </div>
      <div className="flex flex-row justify-between">
        <Body3 className="text-black">Shipping</Body3>
        <Body3 className="neutral-500 text-black">
          Harga IDR {shippingPrice}
        </Body3>
      </div>
      <div className="flex flex-row justify-between">
        <H3 className="text-bold text-black">Total</H3>
        <H3 className="text-black">IDR {totalPrice}</H3>
      </div>
      <Button
        disabled={checkoutDisabled}
        onClick={handleCheckout}
        className="w-full"
      >
        Checkout
      </Button>
    </div>
  );
};
