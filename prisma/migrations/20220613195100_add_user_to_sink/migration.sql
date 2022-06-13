-- AlterTable
ALTER TABLE "Sink" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Sink" ADD CONSTRAINT "Sink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
