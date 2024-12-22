/*
  Warnings:

  - Added the required column `desired_carrier_name` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "desired_carrier_name" TEXT NOT NULL;
