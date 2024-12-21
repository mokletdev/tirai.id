"use client";

import Image from "next/image";
import { FC, useMemo } from "react";

export const PhotosPreview: FC<{
  images?: File[] | null;
  updateData?: { photos: string[] };
}> = ({ images, updateData }) => {
  // Memoize the object URL to avoid re-creating it on each render
  const imageUrls = useMemo(() => {
    if (images) {
      const urls = Array.from(images).map((image) =>
        URL.createObjectURL(image),
      );
      return urls;
    }

    return updateData?.photos;
  }, [images, updateData?.photos]);

  if (!imageUrls) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-2">
      {imageUrls.map((imageUrl, index) => (
        <Image
          key={index}
          src={imageUrl}
          width={300}
          height={200}
          alt="Photo Preview"
          className="max-h-64 object-cover"
          unoptimized
        />
      ))}
    </div>
  );
};
