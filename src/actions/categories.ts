"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createCategory,
  findCategory,
  updateCategory,
} from "@/utils/database/category.query";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const upsertCategory = async (data: {
  id?: string;
  name: string;
  slug: string;
}): Promise<ActionResponse<{ message: string }>> => {
  const { id, name, slug } = data;

  try {
    if (!id) {
      const existingSlug = await findCategory({ slug });

      if (existingSlug) {
        return ActionResponses.badRequest("The slug is already in use");
      }

      const payload: Prisma.ProductCategoryCreateInput = {
        name,
        slug,
      };

      await createCategory({
        ...payload,
      });
      return ActionResponses.success({
        message: "Category created successfully",
      });
    }

    await updateCategory({ id }, { name, slug });

    revalidatePath("/admin/shop/category");
    return ActionResponses.success({
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert category");
  }
};
