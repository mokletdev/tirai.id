import { FC } from "react";
import Image from "next/image";
import { Body3, H5 } from "@/components/ui/text";
import { ProductCatalog } from "@/types/entityRelations";
import { formatRupiah } from "@/lib/utils";

export const ProductCard: FC<{ product: ProductCatalog }> = ({ product }) => {
  return (
    <div className="flex flex-col">
      <Image
        src="https://static.vecteezy.com/system/resources/thumbnails/003/169/495/small/curtain-with-sunlight-free-photo.jpg"
        alt="Product image"
        unoptimized
        className="mb-[1.375rem] aspect-[2.25/1] rounded-[20px] object-cover"
        width={280}
        height={175}
      />
      <H5 className="line-clamp-1 text-black">Classic Harmony Window Blinds</H5>
      <Body3 className="line-clamp-1 justify-start text-neutral-500">
        Lorem ipsum dolor Lorem ipsum dolor
      </Body3>
      <H5 className="justify-start text-black">{formatRupiah(20000000)}</H5>
    </div>
  );
};
