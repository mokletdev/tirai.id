/*
  Warnings:

  - You are about to drop the column `color` on the `CustomRequest` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the `CustomColor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `Model` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Model_model_key";

-- AlterTable
ALTER TABLE "CustomRequest" DROP COLUMN "color",
ADD COLUMN     "is_custom_carrier" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "image" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "model",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "is_custom_carrier" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "CustomColor";

-- CreateTable
CREATE TABLE "Referal" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "fee_in_percent" DOUBLE PRECISION NOT NULL,
    "discount_in_percent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Referal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderToReferal" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToReferal_AB_unique" ON "_OrderToReferal"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToReferal_B_index" ON "_OrderToReferal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");

-- AddForeignKey
ALTER TABLE "Referal" ADD CONSTRAINT "Referal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToReferal" ADD CONSTRAINT "_OrderToReferal_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToReferal" ADD CONSTRAINT "_OrderToReferal_B_fkey" FOREIGN KEY ("B") REFERENCES "Referal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
