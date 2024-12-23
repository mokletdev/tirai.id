/*
  Warnings:

  - Added the required column `address` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomRequest" ADD COLUMN     "address" TEXT NOT NULL;
