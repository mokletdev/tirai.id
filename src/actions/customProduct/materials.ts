"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createMaterial,
  findMaterial,
  updateMaterial,
  deleteMaterial as deleteMaterialQuery,
} from "@/utils/database/material.query";
import { parsePrice } from "@/utils/format-price";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { uploadSeoImage } from "../seo";

export const upsertMaterial = async (
  data: {
    id?: string;
    name: string;
    price: string;
    supplier_price: string;
    description: string;
    allowedModels: string[];
  },
  imageData: FormData,
): Promise<ActionResponse<{ message: string }>> => {
  const { id, name, price, supplier_price, description, allowedModels } = data;
  const image = imageData.get("image") as File | undefined;
  const existingName = await findMaterial({ name });

  try {
    const imageUpload = image ? await uploadSeoImage(image) : undefined;
    const models = allowedModels.map((i) => ({
      name: i,
    }));

    const payload: Prisma.MaterialUpdateInput = {
      name,
      price: parsePrice(price),
      supplier_price: parsePrice(supplier_price),
      description,
      image: imageUpload!,
      allowed_model: {
        connect: models,
      },
    };

    if (!id) {
      if (existingName) {
        return ActionResponses.badRequest("The name is already in use");
      }

      await createMaterial(payload as Prisma.MaterialCreateInput);
      return ActionResponses.success({
        message: "Material created successfully",
      });
    }

    if (existingName) {
      const disconnectedModels = existingName.allowed_model.filter(
        (i) => !allowedModels.some((j) => i.name === j),
      );
      payload.allowed_model!.disconnect = disconnectedModels.map((i) => ({
        name: i.name,
      }));
    }

    await updateMaterial({ id }, payload);

    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Material updated successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert material");
  }
};

export const deleteMaterial = async (
  id: string,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const material = await findMaterial({ id });
    if (!material) return ActionResponses.notFound("Material not found.");

    await deleteMaterialQuery({ id });

    revalidatePath("/", "layout");
    return ActionResponses.success({ id });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to delete material");
  }
};
