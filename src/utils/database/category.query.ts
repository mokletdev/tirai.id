import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findCategories = async (
  where?: Prisma.ProductCategoryWhereInput,
  select?: Prisma.ProductCategorySelect,
) => {
  const categories = await prisma.productCategory.findMany({ where, select });

  return categories;
};

export const findCategory = async (
  where: Prisma.ProductCategoryWhereUniqueInput,
) => {
  const category = await prisma.productCategory.findUnique({ where });

  return category;
};

export const createCategory = async (
  data: Prisma.ProductCategoryCreateInput,
) => {
  const category = await prisma.productCategory.create({ data });

  return category;
};

export const updateCategory = async (
  where: Prisma.ProductCategoryWhereUniqueInput,
  data: Prisma.ProductCategoryUpdateInput,
) => {
  const category = await prisma.productCategory.update({ where, data });

  return category;
};
