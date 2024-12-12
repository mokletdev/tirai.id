"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { PaginatedResult } from "@/lib/paginator";
import { ProductCatalog } from "@/types/entityRelations";
import { FC } from "react";
import { ProductCard } from "./ProductCard";
import { Body1, Body3 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";

export const ProductList: FC<{
  paginatedProducts: PaginatedResult<ProductCatalog>;
}> = ({ paginatedProducts }) => {
  return (
    <SectionContainer id="products">
      {paginatedProducts.meta.total === 0 && (
        <Body1 className="w-full text-center text-neutral-500">
          Belum ada produk apapun hari ini...
        </Body1>
      )}
      <div className="flex w-full items-center justify-between">
        {paginatedProducts.meta.total !== 0 && (
          <div className="w-full">
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {paginatedProducts.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <PageSelector meta={paginatedProducts.meta} />
          </div>
        )}
      </div>
    </SectionContainer>
  );
};
