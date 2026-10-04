-- AlterTable
ALTER TABLE "UsageLog" ADD COLUMN "requestId" TEXT NOT NULL DEFAULT 'legacy-missing-request-id';
ALTER TABLE "UsageLog" ADD COLUMN "scrape_duration_ms" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SavedFilterResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "savedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "filter_applied" TEXT NOT NULL,
    "entries" TEXT NOT NULL,
    "entryCount" INTEGER NOT NULL,
    "label" TEXT
);

-- CreateIndex
CREATE INDEX "SavedFilterResult_userId_savedAt_idx" ON "SavedFilterResult"("userId", "savedAt");
