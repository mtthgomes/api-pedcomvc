/*
  Warnings:

  - You are about to drop the column `specialty` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "specialty";

-- AlterTable
ALTER TABLE "Guardian" ADD COLUMN     "stateId" TEXT;

-- DropEnum
DROP TYPE "MedicalSpecialty";

-- AddForeignKey
ALTER TABLE "Guardian" ADD CONSTRAINT "Guardian_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;
