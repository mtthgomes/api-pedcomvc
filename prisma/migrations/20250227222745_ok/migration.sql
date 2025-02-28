/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `photo` on table `Doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "cpf" TEXT NOT NULL,
ALTER COLUMN "photo" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_cpf_key" ON "Doctor"("cpf");
