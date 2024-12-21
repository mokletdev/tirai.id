import { findCategory } from "@/utils/database/category.query";
import { notFound } from "next/navigation";
import CategoryForm from "../components/CategoryForm";

export default async function UpdateCategory({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const category = await findCategory({ id });
  if (!category) return notFound();

  return <CategoryForm updateData={category} />;
}
