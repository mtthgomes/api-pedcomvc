/*
  Warnings:

  - Made the column `getStreamToken` on table `Guardian` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Guardian` MODIFY `getStreamToken` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Version` (
    `id` VARCHAR(191) NOT NULL,
    `versionCode` INTEGER NOT NULL,
    `versionName` VARCHAR(191) NOT NULL,
    `requiredUpdate` BOOLEAN NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
