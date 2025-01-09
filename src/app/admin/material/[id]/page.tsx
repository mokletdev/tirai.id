import { findMaterial } from "@/utils/database/material.query";
import { notFound } from "next/navigation";
import MaterialForm from "../components/MaterialForm";
import { findModels } from "@/utils/database/model.query";

export default async function UpdateMaterial({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const material = await findMaterial({ id });
  const models = await findModels();
  if (!material || !models) return notFound();

  return <MaterialForm updateData={material} models={models} />;
}
