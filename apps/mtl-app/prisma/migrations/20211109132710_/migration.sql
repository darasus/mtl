/*
  Warnings:

  - A unique constraint covering the columns `[compound_id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `compound_id` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "compound_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_compound_id_key" ON "Account"("compound_id");
