import { PageContainer } from "@/components/layout/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, Display } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import prisma from "@/lib/prisma";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { ShieldClose } from "lucide-react";
import Link from "next/link";
import { Form } from "./components/Form";

export default async function Calculator() {
  const [models, materials] = await prisma.$transaction([
    prisma.model.findMany({
      select: {
        id: true,
        description: true,
        image: true,
        name: true,
      },
    }),
    prisma.material.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        supplier_price: true,
        image: true,
      },
    }),
  ]);

  const customerDiscount = await findDiscountByRole("CUSTOMER");
  const supplierDiscount = await findDiscountByRole("SUPPLIER");

  if (models.length < 1 || materials.length < 1)
    return (
      <main className="flex min-h-screen w-full items-center justify-center">
        <section className="flex w-full max-w-[380px] flex-col items-center">
          <div className="justify center mb-8 flex w-fit items-center rounded-full bg-primary-50 p-6">
            <ShieldClose color={COLORS.primary[900]} size={52} />
          </div>
          <div className="flex w-full flex-col items-center text-center text-black">
            <Display className="mb-3">Produk Kustom Belum Tersedia</Display>
            <Body3 className="mb-[3.375rem] text-neutral-500">
              Maaf, saat ini bahan dan model untuk produk kustom belum tersedia.
              Silakan coba lagi nanti
            </Body3>
            <Link
              href={"/"}
              className={buttonVariants({
                variant: "default",
                className: "w-full",
              })}
            >
              Kembali ke beranda
            </Link>
          </div>
        </section>
      </main>
    );

  return (
    <PageContainer>
      <Form
        models={models}
        materials={materials}
        customerDiscount={customerDiscount}
        supplierDiscount={supplierDiscount}
      />
    </PageContainer>
  );
}
