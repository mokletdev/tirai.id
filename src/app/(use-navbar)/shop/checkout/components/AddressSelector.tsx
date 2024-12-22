"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { ShippingAddress } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Body1 } from "@/components/ui/text";

export const AddressSelector = ({
  addresses,
  address,
  setAddress,
}: {
  addresses: ShippingAddress[];
  address: string | undefined;
  setAddress: Dispatch<SetStateAction<string | undefined>>;
}) => {
  return (
    <div className="w-full">
      <Body1 className="mb-4">Alamat Pengiriman</Body1>
      <div className="flex w-full flex-col gap-2">
        <Select
          onValueChange={(value) => {
            setAddress(value);
          }}
          value={address}
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
