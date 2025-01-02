import { H1 } from "@/components/ui/text";
import prisma from "@/lib/prisma";
import { ColorTable } from "./components/ColorTable";

export default async function CustomProductMaterials() {
  const colors = await prisma.customColor.findMany();

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Warna</H1>
      <div className="mb-2">
        <ColorTable colors={colors} />
      </div>
    </div>
  );
}
