"use client";

import { upsertCheckout } from "@/actions/checkout";
import { Body1 } from "@/components/ui/text";
import { CartItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { ShippingAddress } from "@prisma/client";
import { FC, useState } from "react";
import { AddressSelector } from "./AddressSelector";
import { Details } from "./Details";
import { ProductCard } from "./ProductCard";

export const CheckoutForm: FC<{
  addresses: ShippingAddress[];
  cart: CartItem[];
  products: ProductWithVariant[];
}> = ({ addresses, cart, products }) => {
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleCheckOut = async () => {
    if (selectedAddress) {
      setLoading(true);
      const res = await upsertCheckout(cart, selectedAddress, { code: "" });

      window.open(res.data?.payment_link_url!, "_blank");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex h-full w-full flex-col items-start !overflow-y-scroll">
        <div className="w-full">
          <Body1>Alamat Pengiriman</Body1>
          <div className="flex w-full flex-col gap-2">
            <AddressSelector
              currAddress={selectedAddress}
              setAddress={setSelectedAddress}
              addresses={addresses}
            />
          </div>
        </div>
        <div className="flex w-full flex-col">
          {cart.map((i) => (
            <ProductCard
              cartItem={i}
              product={
                products[products.findIndex((j) => j.id === i.productId)]
              }
              key={i.id}
            />
          ))}
        </div>
      </div>
      <Details
        products={products}
        checkoutDisabled={!selectedAddress || loading}
        handleCheckout={handleCheckOut}
      />
    </div>
  );
};
