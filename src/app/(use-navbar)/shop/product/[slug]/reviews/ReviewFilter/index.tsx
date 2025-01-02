"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next-nprogress-bar";
import { FC, useCallback, useEffect, useState } from "react";
import { SelectFilter } from "./SelectFilter";

interface ReviewFilterProps {
  rating: string | undefined;
  page?: string;
}

export const ReviewFilter: FC<{
  searchData: ReviewFilterProps;
}> = ({ searchData }) => {
  const [rating, setRating] = useState(searchData.rating ?? "");

  const router = useRouter();

  const saveFilters = useCallback(() => {
    const params = new URLSearchParams();

    const appendIfExists = (key: string, value: string | undefined) => {
      if (value?.trim()) {
        params.append(key, value.trim());
      }
    };

    appendIfExists("rating", rating);

    if (searchData.page) {
      params.append("page", searchData.page);
    }

    router.push(`?${params.toString()}`);
  }, [rating, searchData.page, router]);

  useEffect(() => {
    saveFilters();
  }, [rating, searchData.page, saveFilters]);

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <SelectFilter rating={rating} setRating={setRating} />
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          setRating("");
          router.push("?");
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
};
