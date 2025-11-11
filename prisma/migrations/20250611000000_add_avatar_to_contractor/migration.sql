-- AlterTable
ALTER TABLE "contractor" ADD COLUMN "avatar" VARCHAR(500);

-- CreateIndex (optional, for faster avatar queries)
CREATE INDEX "contractor_avatar_idx" ON "contractor"("avatar") WHERE "avatar" IS NOT NULL;
