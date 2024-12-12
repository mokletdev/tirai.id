import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { ProductCatalog } from "@/types/entityRelations";
import { Prisma } from "@prisma/client";
import { Hero } from "./components/Hero";
import { ProductList } from "./components/ProductsList";

const paginate = paginator({ perPage: 10 });

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: queryPage } = await searchParams;
  const page = parseInt(queryPage || "1");
  const paginatedProducts = await paginate<
    ProductCatalog,
    Prisma.ProductFindManyArgs
  >(
    prisma.product,
    { page },
    {
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        photos: true,
        is_published: true,
        created_at: true,
        updated_at: true,
        variants: {
          select: {
            stock: true,
            price: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    },
  );

  return (
    <>
      <Hero />
      <ProductList paginatedProducts={paginatedProducts} />
    </>
  );
}
