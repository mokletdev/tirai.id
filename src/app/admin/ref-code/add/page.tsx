import ReferalForm from "../components/ReferalForm";
import prisma from "@/lib/prisma";

export default async function ReferalAddPage() {
  const affiliators = await prisma.user.findMany({
    where: { role: "AFFILIATE" },
    select: { id: true, name: true, email: true },
  });

  return <ReferalForm affiliators={affiliators} />;
}
