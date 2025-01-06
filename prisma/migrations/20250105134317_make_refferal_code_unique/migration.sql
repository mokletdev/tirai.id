/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Referal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Referal_code_key" ON "Referal"("code");
