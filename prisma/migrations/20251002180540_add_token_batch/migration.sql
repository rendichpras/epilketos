-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "batchId" TEXT;

-- CreateTable
CREATE TABLE "TokenBatch" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "TokenBatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "TokenBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
