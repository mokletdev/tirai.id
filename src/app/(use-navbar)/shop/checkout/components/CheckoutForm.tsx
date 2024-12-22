"use client";

import { upsertCheckout } from "@/actions/checkout";
import { Body1 } from "@/components/ui/text";
import { CartItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { ShippingAddress } from "@prisma/client";
import { FC, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { AddressSelector } from "./AddressSelector";
import { Details } from "./Details";
import { ProductCard } from "./ProductCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CourierSelector } from "./CourierSelector";

export const CheckoutForm: FC<{
  addresses: ShippingAddress[];
  cart: CartItem[];
  products: ProductWithVariant[];
}> = ({ addresses, cart, products }) => {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    addresses.length > 0 ? addresses[0].id : undefined,
  );
  const [selectedCourier, setSelectedCourier] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckOut = async () => {
    if (selectedAddress) {
      setLoading(true);
      const res = await upsertCheckout(cart, selectedAddress, { code: "" });
      console.log(res.data);
      router.push(res.data?.payment_link_url!);

      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-start justify-between gap-x-6 lg:flex-row">
      <div className="mb-6 flex h-full w-full flex-col items-start">
        <div className="flex w-full flex-col gap-y-8">
          <AddressSelector
            address={selectedAddress}
            setAddress={setSelectedAddress}
            addresses={addresses}
          />
          {selectedAddress !== undefined && (
            <CourierSelector
              address={selectedAddress}
              courier={selectedCourier}
              setCourier={setSelectedCourier}
            />
          )}
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
