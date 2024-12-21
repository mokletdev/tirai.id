import { buttonVariants } from "@/components/ui/button";
import { Body3, H1 } from "@/components/ui/text";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

export const EmptyCart: FC = () => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
      <ShoppingCart className="mb-16 size-28 text-primary-900" />
      <H1 className="mb-2 text-black">Belum Ada Apapun di Keranjangmu</H1>
      <Body3 className="mb-8 text-neutral-500">
        Yuk, isi dengan produk-produk keren dari Tirai.id!
      </Body3>
      <Link
        href={"/shop"}
        className={buttonVariants({
          variant: "default",
          className: "min-w-64",
          size: "lg",
        })}
      >
        Belanja sekarang
      </Link>
    </div>
  );
};
