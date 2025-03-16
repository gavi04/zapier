/*
  Warnings:

  - You are about to drop the column `name` on the `Action` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[zapId]` on the table `Action` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Action_zapId_key" ON "Action"("zapId");
