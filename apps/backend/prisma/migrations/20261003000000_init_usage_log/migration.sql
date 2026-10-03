-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL,
    "filter_applied" TEXT NOT NULL,
    "processed_items" INTEGER NOT NULL,
    "execution_time_ms" INTEGER NOT NULL,
    "userId" TEXT NOT NULL
);
