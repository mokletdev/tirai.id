import { updateCart } from "@/actions/cart";
import { PageContainer } from "@/components/layout/PageContainer";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { CartItem } from "@/types/cart";
import { notFound, redirect } from "next/navigation";
import { CheckoutForm } from "./components/CheckoutForm";

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

  // Update the cart in case the user does not come from the cart page
  const filteredCart = cart.filter((item) => {
    const product = products.find((product) => product.id === item.productId);
    if (!product) return false;

    if (product.price !== null) return true;

    return product.variants.some((variant) => variant.id === item.variantId);
  });

  if (filteredCart.length !== cart.length) {
    await updateCart(filteredCart);
  }

  // If the filteredCart is empty, then redirect to cart page
  if (filteredCart.length === 0) {
    return redirect("/cart");
  }

  return (
    <PageContainer className="flex h-[90vh] px-4 text-black">
      <CheckoutForm addresses={addresses} cart={cart} products={products} />
    </PageContainer>
  );
}
