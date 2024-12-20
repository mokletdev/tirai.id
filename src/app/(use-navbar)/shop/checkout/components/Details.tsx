import { Body3, H3 } from "@/components/ui/text";
import { FC } from "react";

export const Details: FC = () => {
  return (
    <div className="flex w-1/2 flex-col justify-start">
      <div className="flex flex-row justify-between">
        <Body3 className="text-black">Subtotal</Body3>
        <Body3 className="text-black">Harga Subtotal</Body3>
      </div>
      <div className="flex flex-row justify-between">
        <Body3 className="text-black">Shipping</Body3>
        <Body3 className="neutral-500 text-black">Harga shipping</Body3>
      </div>
      <div className="flex flex-row justify-between">
        <H3 className="text-bold text-black">Total</H3>
        <H3 className="text-black">IDR 696969</H3>
      </div>
    </div>
  );
};
