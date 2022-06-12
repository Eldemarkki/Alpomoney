-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_storageId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "storageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
