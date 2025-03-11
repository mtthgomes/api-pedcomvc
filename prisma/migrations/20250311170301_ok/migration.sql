/*
  Warnings:

  - A unique constraint covering the columns `[rqe]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Doctor` ADD COLUMN `specialty` ENUM('GENERAL_PEDIATRICS', 'ALLERGY_IMMUNOLOGY', 'PEDIATRIC_CARDIOLOGY', 'PEDIATRIC_ENDOCRINOLOGY', 'PEDIATRIC_GASTROENTEROLOGY', 'PEDIATRIC_HEMATOLOGY', 'PEDIATRIC_INFECTOLOGY', 'ADOLESCENT_MEDICINE', 'NEONATAL_INTENSIVE_CARE', 'PEDIATRIC_INTENSIVE_CARE', 'PEDIATRIC_NEPHROLOGY', 'PEDIATRIC_NEUROLOGY', 'PEDIATRIC_NUTROLOGY', 'PEDIATRIC_ONCOLOGY', 'PEDIATRIC_PNEUMOLOGY', 'PEDIATRIC_RHEUMATOLOGY') NULL;

-- CreateTable
CREATE TABLE `RiskClassification` (
    `id` VARCHAR(191) NOT NULL,
    `age_min` INTEGER NULL,
    `age_max` INTEGER NULL,
    `has_comorbidities` BOOLEAN NOT NULL,
    `risk_level` VARCHAR(191) NOT NULL,
    `recommendation` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RiskSymptoms` (
    `id` VARCHAR(191) NOT NULL,
    `symptom` VARCHAR(191) NOT NULL,
    `riskClassificationId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Doctor_rqe_key` ON `Doctor`(`rqe`);

-- AddForeignKey
ALTER TABLE `RiskSymptoms` ADD CONSTRAINT `RiskSymptoms_riskClassificationId_fkey` FOREIGN KEY (`riskClassificationId`) REFERENCES `RiskClassification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
