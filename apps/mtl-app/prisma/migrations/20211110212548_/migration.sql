/*
  Warnings:

  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nickname` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email_verified` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "nickname" SET NOT NULL,
ALTER COLUMN "email_verified" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
