"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { PaginatedResult } from "@/lib/paginator";
import { ProductWithCategoryReviewsVariants } from "@/types/entityRelations";
import {
  createProduct,
  deleteProduct,
  findProduct,
  updateProduct,
} from "@/utils/database/product.query";
import { revalidatePath } from "next/cache";

interface upsertData {
  id?: string;
  slug?: string;
  category?: string;
  name?: string;
  description?: string;
}

export const getProducts = async (
  perPage = 6,
  page = 1,
  sort: "latest" | "popular",
): Promise<
  ActionResponse<PaginatedResult<ProductWithCategoryReviewsVariants>>
> => {
  try {
    const product = await findProduct(perPage, page, sort);
    ActionResponses.success("succes Get Product");
    return ActionResponses.success(product);
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to get Product");
  }
};

export const upsertProduct = async ({
  data,
}: {
  data: upsertData;
}): Promise<ActionResponse<string>> => {
  try {
    if (!data.id) {
      await createProduct({
        category: { connect: { id: data.category } },
        description: data.description!,
        name: data.description!,
        slug: data.slug!,
      });
      return ActionResponses.success("Success Create Product");
    }
    await updateProduct(
      { id: data.id },
      {
        category: data.category
          ? { connect: { id: data.category } }
          : undefined,
        description: data.description,
        name: data.name,
        slug: data.slug,
      },
    );
    return ActionResponses.success("Success Update Product");
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to upsert Product");
  }
};

export const changeProductPublishedStatus = async (
  id: string,
  status: boolean,
) => {
  try {
    await updateProduct(
      { id: id },
      {
        is_published: status,
      },
    );
    revalidatePath("/admin/shop/product");
    return ActionResponses.success("Success Update Product");
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to upsert Product");
  }
};

export const removeProduct = async (id: string) => {
  try {
    await deleteProduct({ id });
    revalidatePath("/admin/shop/product");
    return ActionResponses.success("Success delete Product");
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to delete Product");
  }
};
