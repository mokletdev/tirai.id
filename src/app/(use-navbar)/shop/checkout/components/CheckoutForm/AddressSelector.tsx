"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Body1 } from "@/components/ui/text";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { ShippingAddress } from "@prisma/client";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export const AddressSelector = ({
  addresses,
  addressId,
  setAddressId,
}: {
  addresses: ShippingAddress[];
  addressId: string | undefined;
  setAddressId: Dispatch<SetStateAction<string | undefined>>;
}) => {
  return (
    <div className="w-full">
      <Body1 className="mb-4">Alamat Pengiriman</Body1>
      <div className="flex w-full flex-col gap-2">
        <Select
          onValueChange={(value) => {
            setAddressId(value);
          }}
          value={addressId}
          disabled={addresses.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              className="text-black"
              placeholder={
                addresses.length === 0
                  ? "Anda belum mengisi alamat"
                  : "Pilih alamat"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {addresses.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {buildShipmentAddressString(a)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Link
          href={"/account/address"}
          className={buttonVariants({ variant: "default" })}
        >
          Tambah alamat
        </Link>
      </div>
    </div>
  );
};
