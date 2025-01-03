"use client";

import { upsertReview } from "@/actions/review";
import { ReviewCard } from "@/app/(use-navbar)/shop/product/[slug]/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Body3 } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { ReviewWithOrderUser } from "@/types/entityRelations";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "sonner";
import { StarsSelector } from "./StarsSelector";

interface ReviewCreateData {
  order_id: string;
  order_item_id: string;
  product_id: string;
}

export const ReviewForm: FC<{
  review: ReviewWithOrderUser | null;
  data: ReviewCreateData;
}> = ({ review, data }) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState<string>();

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    const loadingId = toast.loading("Mengirim ulasan...");
    const { order_id, order_item_id, product_id } = data;

    if (!content || rating === 0) {
      setLoading(false);
      return toast.error("Gagal mengirim ulasan", {
        id: loadingId,
      });
    }

    const res = await upsertReview({
      content,
      rating,
      order_id,
      order_item_id,
      product_id,
    });

    if (!res.success) {
      setLoading(false);
      return toast.error("Gagal mengirim ulasan", {
        id: loadingId,
      });
    }

    setLoading(false);
    toast.success("Berhasil mengirim ulasan", {
      id: loadingId,
    });
    return router.refresh();
  };

  return (
    <>
      <Separator />
      {!review ? (
        <form onSubmit={handleSubmit}>
          <Body3 className="mb-5 font-medium text-black">Review</Body3>
          <StarsSelector onRatingChange={(r) => setRating(r)} />
          <Textarea
            className="mt-3"
            placeholder="Tulis ulasan anda..."
            disabled={review !== null}
            required
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            className="mt-3 w-full"
            type="submit"
            disabled={loading || !content || rating === 0}
          >
            Kirim ulasan
          </Button>
        </form>
      ) : (
        <div className="mt-3 w-full">
          <ReviewCard review={review} />
        </div>
      )}
    </>
  );
};
