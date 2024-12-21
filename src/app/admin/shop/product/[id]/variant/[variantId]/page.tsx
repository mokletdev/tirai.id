import { findProductVariant } from "@/utils/database/productVariant.query";
import { notFound } from "next/navigation";
import { VariantForm } from "../components/VariantForm";

export default async function EditVariant({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}) {
  const { id, variantId } = await params;
  const productVariant = await findProductVariant({
    id: variantId,
  });
  if (!productVariant) return notFound();

  return (
    <section id="update-variant-form" className="w-full pb-8">
      <VariantForm productId={id} updateData={productVariant} />
    </section>
  );
}
