import { notFound } from "next/navigation";
import ColorForm from "../components/ColorForm";
import prisma from "@/lib/prisma";

export default async function UpdateMaterial({
  params,
}: Readonly<{
  params: Promise<{ id: number }>;
}>) {
  const { id } = await params;
  if (!id) return notFound();

  const color = await prisma.customColor.findUnique({ where: { id } });
  if (!color) return notFound();

  return <ColorForm updateData={color} />;
}
