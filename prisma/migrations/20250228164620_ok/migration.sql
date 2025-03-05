/*
  Warnings:

  - You are about to alter the column `comorbidity` on the `Dependent` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - You are about to alter the column `medication` on the `Dependent` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.
  - You are about to alter the column `allergy` on the `Dependent` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Dependent` MODIFY `comorbidity` VARCHAR(191) NULL,
    MODIFY `medication` VARCHAR(191) NULL,
    MODIFY `allergy` VARCHAR(191) NULL;
