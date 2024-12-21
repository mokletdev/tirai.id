import { findCategories } from "@/utils/database/category.query";
import { ProductForm } from "../components/ProductForm";

export default async function AddProductPage() {
  const categories = await findCategories();

  return (
    <section id="create-article-form" className="w-full pb-8">
      <ProductForm categories={categories} />
    </section>
  );
}
