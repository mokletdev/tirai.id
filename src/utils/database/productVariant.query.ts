import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createProductVariant = async (
  data: Prisma.ProductVariantCreateInput,
) => {
  return await prisma.productVariant.create({ data });
};

export const updateProductVariant = async (
  where: Prisma.ProductVariantWhereUniqueInput,
  data: Prisma.ProductVariantUpdateInput,
) => {
  return await prisma.productVariant.update({ where, data });
};

export const deleteProductVariant = async (
  where: Prisma.ProductVariantWhereUniqueInput,
) => {
  return await prisma.productVariant.delete({ where });
};

export const findProductVariant = async (
  where: Prisma.ProductVariantWhereUniqueInput,
) => {
  const productVariant = await prisma.productVariant.findUnique({ where });
  return productVariant;
};

export const findProductVariants = async (
  where?: Prisma.ProductVariantWhereInput,
) => {
  const productVariants = await prisma.productVariant.findMany({ where });
  return productVariants;
};
