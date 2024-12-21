import { VariantForm } from "../components/VariantForm";

export default async function AddVariant({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <VariantForm productId={id} />;
}
