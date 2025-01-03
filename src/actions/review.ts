"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { createReview } from "@/utils/database/review.query";
import { revalidatePath } from "next/cache";

export const upsertReview = async (data: {
  order_id: string;
  order_item_id: string;
  product_id: string;
  content: string;
  rating: number;
}): Promise<ActionResponse<{ message: string }>> => {
  const { content, order_id, order_item_id, product_id, rating } = data;

  try {
    await createReview({
      content,
      order: { connect: { id: order_id } },
      product: { connect: { id: product_id } },
      order_item: { connect: { id: order_item_id } },
      rating,
    });

    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Discount created successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert discount");
  }
};
