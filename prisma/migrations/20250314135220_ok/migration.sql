/*
  Warnings:

  - You are about to alter the column `comorbidity` on the `Dependent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `medication` on the `Dependent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `allergy` on the `Dependent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `otherInfo` on the `Dependent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE `Dependent` MODIFY `comorbidity` VARCHAR(150) NULL,
    MODIFY `medication` VARCHAR(150) NULL,
    MODIFY `allergy` VARCHAR(150) NULL,
    MODIFY `otherInfo` VARCHAR(150) NULL;
