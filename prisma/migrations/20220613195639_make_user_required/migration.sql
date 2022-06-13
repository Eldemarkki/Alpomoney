/*
  Warnings:

  - Made the column `userId` on table `Sink` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sink" DROP CONSTRAINT "Sink_userId_fkey";

-- AlterTable
ALTER TABLE "Sink" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sink" ADD CONSTRAINT "Sink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
