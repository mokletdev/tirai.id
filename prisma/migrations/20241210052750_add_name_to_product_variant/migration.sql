/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_name_key" ON "ProductVariant"("name");
