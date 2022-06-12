/*
  Warnings:

  - Added the required column `name` to the `RecurringTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecurringTransaction" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;
