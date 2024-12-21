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

export const AddressSelector = ({
  addresses,
  currAddress,
  setAddress,
}: {
  addresses: ShippingAddress[];
  currAddress: string | undefined;
  setAddress: Dispatch<SetStateAction<string | undefined>>;
}) => {
  return (
    <Select
      onValueChange={(value) => {
        setAddress(value);
      }}
      value={currAddress}
    >
      <SelectTrigger className="w-full">
        <SelectValue className="text-black">
          {currAddress
            ? buildShipmentAddressString(
                addresses.find((i) => i.id === currAddress)!,
              )
            : "Pilih alamat"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {addresses.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {buildShipmentAddressString(a)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
