import { Prisma } from "@prisma/client";

export type ArticleWithUser = Prisma.ArticleGetPayload<{
  include: {
    author: { select: { name: true; role: true } };
  };
}>;

export type ProductCategoryWithProductIds = Prisma.ProductCategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    updated_at: true;
    products: { select: { id: true } };
  };
}>;
