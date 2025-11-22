/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Recommendation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Food_name_key";

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_userId_key" ON "Recommendation"("userId");
