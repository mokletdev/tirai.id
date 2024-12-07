import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return await prisma.product.create({ data });
};

export const updateProduct = async (
  where: Prisma.ProductWhereUniqueInput,
  data: Prisma.ProductUpdateInput,
) => {
  return await prisma.product.update({ where, data });
};

export const deleteProduct = async (where: Prisma.ProductWhereUniqueInput) => {
  return await prisma.product.delete({ where });
};

export const findProduct = async (
  perPage = 6,
  page = 1,
  sort: "latest" | "popular",
  filter?: Prisma.ProductWhereUniqueInput,
) => {
  const paginate = paginator({ perPage });
  return await paginate<
    Prisma.ProductGetPayload<{
      include: {
        category: {
          select: {
            name: true;
            id: true;
          };
        };
        reviews: {
          select: {
            rating: true;
          };
        };
        variants: {
          select: {
            _count: true;
            photo: true;
          };
        };
      };
    }>,
    Prisma.ProductFindManyArgs
  >(
    prisma.product,
    { page },
    {
      where: {
        ...filter,
      },
      orderBy:
        sort === "latest"
          ? { created_at: "desc" }
          : sort === "popular"
            ? { reviews: { _count: "desc" } }
            : undefined,
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        variants: {
          select: {
            _count: true,
            photo: true,
          },
        },
      },
    },
  );
};

export const findProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          name: true,
          id: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
      variants: {
        select: {
          _count: true,
          photo: true,
        },
      },
    },
  });
};
