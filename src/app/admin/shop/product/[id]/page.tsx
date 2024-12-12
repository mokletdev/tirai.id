import { findCategories } from "@/utils/database/category.query";
import { ProductForm } from "../components/ProductForm";
import { findProductById } from "@/utils/database/product.query";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await findCategories();
  const product = await findProductById(id);
  if (!product) return notFound();

  return (
    <section id="update-product-form" className="w-full pb-8">
      <ProductForm categories={categories} updateData={product} />
    </section>
  );
}
