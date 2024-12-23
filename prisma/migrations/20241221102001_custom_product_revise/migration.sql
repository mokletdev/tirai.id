/*
  Warnings:

  - You are about to drop the column `supplier_price` on the `CustomRequest` table. All the data in the column will be lost.
  - Added the required column `userId` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomRequest" DROP COLUMN "supplier_price",
ADD COLUMN     "shipping_price" DOUBLE PRECISION,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "image" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomRequest" ADD CONSTRAINT "CustomRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
