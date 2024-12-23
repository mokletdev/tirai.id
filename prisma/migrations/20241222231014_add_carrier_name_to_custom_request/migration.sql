/*
  Warnings:

  - You are about to drop the column `desired_carrier_name` on the `Order` table. All the data in the column will be lost.
  - Added the required column `method` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'QRIS', 'E_WALLET');

-- DropIndex
DROP INDEX "Payment_transaction_id_key";

-- AlterTable
ALTER TABLE "CustomRequest" ADD COLUMN     "carrier_code" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "desired_carrier_name";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "method" "PaymentMethod" NOT NULL;
