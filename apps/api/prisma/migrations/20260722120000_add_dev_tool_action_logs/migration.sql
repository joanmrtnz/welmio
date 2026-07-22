-- CreateTable
CREATE TABLE "DevToolActionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevToolActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DevToolActionLog_userId_createdAt_idx" ON "DevToolActionLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "DevToolActionLog_actionId_createdAt_idx" ON "DevToolActionLog"("actionId", "createdAt");

-- AddForeignKey
ALTER TABLE "DevToolActionLog" ADD CONSTRAINT "DevToolActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
