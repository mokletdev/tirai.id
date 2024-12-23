/*
  Warnings:

  - Made the column `recipient_name` on table `CustomRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recipient_phone_number` on table `CustomRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CustomRequest" ALTER COLUMN "recipient_name" SET NOT NULL,
ALTER COLUMN "recipient_phone_number" SET NOT NULL;
