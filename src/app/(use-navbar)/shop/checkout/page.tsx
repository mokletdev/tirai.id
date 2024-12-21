import { PageContainer } from "@/components/layout/PageContainer";
import { Body1 } from "@/components/ui/text";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { CartItem } from "@/types/cart";
import { Details } from "./components/Details";
import { ProductCard } from "./components/ProductCard";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { AddressSelector } from "./components/AddressSelector";
import { CheckoutForm } from "./components/CheckoutForm";
import { notFound } from "next/navigation";

export default async function Checkout() {
  const session = await getServerSession();
  if (!session || !session.user) return notFound();
  const addresses = await prisma.shippingAddress.findMany({
    where: {
      user_id: session?.user?.id,
    },
  });
  const cartFetch = await prisma.cart.findUnique({
    where: {
      user_id: session.user.id,
    },
  });
  const cart = cartFetch?.json_content as CartItem[];
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: cart.map((i) => i.productId),
      },
    },
    include: {
      variants: true,
    },
  });

  return (
    <PageContainer className="flex h-[90vh] px-4 text-black">
      <SectionContainer id="checkout">
        <CheckoutForm addresses={addresses} cart={cart} products={products} />
      </SectionContainer>
    </PageContainer>
  );
}
