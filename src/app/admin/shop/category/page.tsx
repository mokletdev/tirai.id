import { H1 } from "@/components/ui/text";
import { findCategories } from "@/utils/database/category.query";
import { CategoryTable } from "./components/CategoryTable";
import { ProductCategoryWithProductIds } from "@/types/entityRelations";

export default async function UserPage() {
  const categories = (await findCategories(undefined, {
    id: true,
    name: true,
    slug: true,
    updated_at: true,
    products: { select: { id: true } },
  })) as unknown as ProductCategoryWithProductIds[];

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Kategori Produk</H1>
      <div className="mb-2">
        <CategoryTable categories={categories} />
      </div>
    </div>
  );
}
