"use client";

import { getCart, updateCart } from "@/actions/cart";
import { CartItem } from "@/types/cart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./use-local-storage";

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart");
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const { status } = useSession();

  const addItem = (item: Omit<CartItem, "id">) => {
    if (cart === undefined) return;

    const existingItem = cart.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId,
    );

    if (existingItem) {
      setCart(
        cart.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        ),
      );
    } else {
      setCart([...cart, { ...item, id: (cart.length + 1).toString() }]);
    }
    setPendingUpdate(true);
  };

  const editItem = (id: string, updates: Partial<Omit<CartItem, "id">>) => {
    if (cart === undefined) return;

    setCart(
      cart.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
    setPendingUpdate(true);
  };

  const removeItem = (id: string) => {
    if (cart === undefined) return;

    setCart(cart.filter((item) => item.id !== id));
    setPendingUpdate(true);
  };

  const clearCart = () => {
    if (cart === undefined) return;

    setCart([]);
    setPendingUpdate(true);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await getCart();

      if (data) {
        setCart(data.cart);
      }
    };

    if (status === "authenticated") {
      init();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const syncCart = async () => {
      await updateCart(cart!);
      setPendingUpdate(false);
    };

    if (pendingUpdate && status === "authenticated") {
      timer = setTimeout(() => {
        syncCart();
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [cart, pendingUpdate]);

  return { cart, setCart, addItem, editItem, removeItem, clearCart };
}
