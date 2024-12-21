/*
  Warnings:

  - You are about to drop the column `color` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProductVariant_product_id_color_size_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "photos" TEXT[];

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "color",
DROP COLUMN "photo";
