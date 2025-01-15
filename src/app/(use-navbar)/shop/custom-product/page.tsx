import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, Display, H1 } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { isReadyStockCart } from "@/lib/utils";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { Ban, ShieldClose } from "lucide-react";
import Link from "next/link";
import { Form } from "./components/Form";

export default async function Page() {
  const session = await getServerSession();

  if (!session?.user) return;

  const [models, materials, addresses, cart] = await prisma.$transaction([
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
        allowed_model: true,
      },
    }),
    prisma.shippingAddress.findMany({
      where: { user_id: session.user.id },
      select: {
        id: true,
        recipient_name: true,
        recipient_phone_number: true,
        street: true,
        village: true,
        district: true,
        city: true,
        province: true,
        postal_code: true,
        additional_info: true,
        is_primary: true,
      },
    }),
    prisma.cart.findUnique({ where: { user_id: session.user.id } }),
  ]);

  const discount = await findDiscountByRole(session.user.role);

  if (
    cart &&
    isReadyStockCart(cart.json_content) &&
    cart.json_content.items.length > 0
  ) {
    return (
      <PageContainer>
        <SectionContainer id="already-filled">
          <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center text-center">
            <Ban className="mb-16 size-28 text-primary-900" />
            <H1 className="mb-2 text-black">Keranjang Sudah Terisi</H1>
            <Body3 className="mb-8 text-balance text-neutral-500">
              Anda hanya bisa memasukkan satu produk kustom ke dalam keranjang.
              Anda juga tidak dapat memasukkan produk kustom jika sudah ada
              produk ready-stock di dalam keranjang anda.
            </Body3>
            <Link
              href={"/cart"}
              className={buttonVariants({
                variant: "default",
                className: "mb-3 min-w-64",
                size: "lg",
              })}
            >
              Lihat keranjang
            </Link>
          </div>
        </SectionContainer>
      </PageContainer>
    );
  }

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
        bahans={materials}
        addresses={addresses}
        user={session.user}
        discount={discount}
      />
    </PageContainer>
  );
}
