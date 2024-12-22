import { CartItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";

/**
 * Calculates the total weight of items in the cart.
 *
 * @param {ProductWithVariant[]} products - Array of products, each containing optional variants and their weights.
 * @param {CartItem[]} cart - Array of cart items, each containing a product ID and an optional variant ID.
 * @returns {number} The total weight of the cart based on the products and their selected variants.
 *
 * @typedef {Object} ProductWithVariant
 * @property {string} id - Unique identifier for the product.
 * @property {number} [weight] - Weight of the product (if it doesn't have variants).
 * @property {Array<Variant>} variants - Array of variants for the product.
 *
 * @typedef {Object} Variant
 * @property {string} id - Unique identifier for the variant.
 * @property {number} weight - Weight of the variant.
 *
 * @typedef {Object} CartItem
 * @property {string} productId - ID of the product in the cart.
 * @property {string} [variantId] - ID of the selected variant in the cart (if any).
 */
export const calculateCartWeight = (
  products: ProductWithVariant[],
  cart: CartItem[],
) => {
  return products.reduce((prev, curr) => {
    const cartItem = cart.find((item) => item.productId === curr.id)!;

    const variant = cartItem.variantId
      ? curr.variants.find((variant) => variant.id === cartItem.variantId)
      : undefined;

    if (variant) {
      return prev + variant.weight;
    }

    return prev + curr.weight!;
  }, 0);
};
