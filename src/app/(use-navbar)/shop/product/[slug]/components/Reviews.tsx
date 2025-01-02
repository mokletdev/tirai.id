import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H3 } from "@/components/ui/text";
import { ReviewWithOrderUser } from "@/types/entityRelations";
import { ReviewCard } from "./ReviewCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const Reviews = ({
  reviews,
  slug,
}: {
  reviews: ReviewWithOrderUser[];
  slug: string;
}) => {
  return (
    <SectionContainer id="Reviews" className="text-black">
      <div className="mb-12 inline-flex w-full items-center justify-between gap-2">
        <H3 className="">Ulasan Pembeli</H3>
        <Link href={`/shop/product/${slug}/reviews`}>
          <span className="inline-flex items-center gap-1 text-primary-500">
            <Body3>Lihat Semua</Body3>
            <ArrowRight strokeWidth={1} />
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard review={review} key={review.id} />
        ))}
      </div>
    </SectionContainer>
  );
};
