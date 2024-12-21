/*
  Warnings:

  - You are about to drop the column `size` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `height` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "size",
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL;
