-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sinkId_fkey";

-- AlterTable
ALTER TABLE "RecurringTransaction" ADD COLUMN     "category" TEXT NOT NULL DEFAULT E'Uncategorized';

-- AlterTable
ALTER TABLE "Sink" ADD COLUMN     "defaultCategory" TEXT NOT NULL DEFAULT E'Uncategorized';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "category" TEXT NOT NULL DEFAULT E'Uncategorized',
ALTER COLUMN "sinkId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sinkId_fkey" FOREIGN KEY ("sinkId") REFERENCES "Sink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
