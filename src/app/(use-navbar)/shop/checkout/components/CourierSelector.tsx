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
import { useState, useEffect } from "react";
import { Body1 } from "@/components/ui/text";
import { Courier } from "@/types/courier";

export const CourierSelector = ({
  address,
  courier,
  setCourier,
}: {
  address: string;
  courier: string | undefined;
  setCourier: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const [couriers, setCouriers] = useState<Courier[]>([]);

  useEffect(() => {
    const init = async () => {
      // Fetch the couriers
    };

    init();
  }, []);

  return (
    <div className="w-full">
      <Body1 className="mb-4">Metode Pengiriman</Body1>
      <div className="flex w-full flex-col gap-2">
        {couriers.length > 0 && (
          <Select
            onValueChange={(value) => {
              setCourier(value);
            }}
            value={courier}
          >
            <SelectTrigger className="w-full">
              <SelectValue className="text-black" placeholder={"Pilih kurir"} />
            </SelectTrigger>
            <SelectContent>
              {couriers.map((c) => (
                <SelectItem
                  key={c.code + " " + c.service}
                  value={c.code + " " + c.service}
                >
                  {c.name} - {c.service} ({c.price})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
