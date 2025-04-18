/*
  Warnings:

  - A unique constraint covering the columns `[account]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_key" ON "accounts"("account");
