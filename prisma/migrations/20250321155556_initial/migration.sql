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

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Country_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `State` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `State_abbreviation_key`(`abbreviation`),
    UNIQUE INDEX `State_name_countryId_key`(`name`, `countryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `stateId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `City_name_stateId_key`(`name`, `stateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guardian` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `cityId` VARCHAR(191) NULL,
    `stateId` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `userType` ENUM('GUARDIAN', 'DEPENDENT', 'DOCTOR', 'ADMIN') NOT NULL DEFAULT 'GUARDIAN',
    `roles` JSON NOT NULL,
    `getStreamRef` VARCHAR(191) NOT NULL,
    `getStreamToken` VARCHAR(191) NOT NULL,
    `firebaseToken` VARCHAR(191) NULL,
    `termsAccepted` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,

    UNIQUE INDEX `Guardian_email_key`(`email`),
    UNIQUE INDEX `Guardian_whatsapp_key`(`whatsapp`),
    UNIQUE INDEX `Guardian_cpf_key`(`cpf`),
    UNIQUE INDEX `Guardian_getStreamRef_key`(`getStreamRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dependent` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `comorbidity` VARCHAR(150) NULL,
    `medication` VARCHAR(150) NULL,
    `allergy` VARCHAR(150) NULL,
    `otherInfo` VARCHAR(150) NULL,
    `relationship` ENUM('PARENT', 'UNCLE', 'SIBLING', 'GRANDPARENT', 'OTHER') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `guardianId` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `cityId` VARCHAR(191) NULL,
    `stateId` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `prefix` VARCHAR(191) NOT NULL,
    `crm` VARCHAR(191) NOT NULL,
    `rqe` VARCHAR(191) NULL,
    `specialty` ENUM('GENERAL_PEDIATRICS', 'ALLERGY_IMMUNOLOGY', 'PEDIATRIC_CARDIOLOGY', 'PEDIATRIC_ENDOCRINOLOGY', 'PEDIATRIC_GASTROENTEROLOGY', 'PEDIATRIC_HEMATOLOGY', 'PEDIATRIC_INFECTOLOGY', 'ADOLESCENT_MEDICINE', 'NEONATAL_INTENSIVE_CARE', 'PEDIATRIC_INTENSIVE_CARE', 'PEDIATRIC_NEPHROLOGY', 'PEDIATRIC_NEUROLOGY', 'PEDIATRIC_NUTROLOGY', 'PEDIATRIC_ONCOLOGY', 'PEDIATRIC_PNEUMOLOGY', 'PEDIATRIC_RHEUMATOLOGY') NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `userType` ENUM('GUARDIAN', 'DEPENDENT', 'DOCTOR', 'ADMIN') NOT NULL DEFAULT 'DOCTOR',
    `roles` JSON NOT NULL,
    `getStreamRef` VARCHAR(191) NOT NULL,
    `getStreamToken` VARCHAR(191) NOT NULL,
    `firebaseToken` VARCHAR(191) NULL,
    `termsAccepted` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Doctor_email_key`(`email`),
    UNIQUE INDEX `Doctor_cpf_key`(`cpf`),
    UNIQUE INDEX `Doctor_whatsapp_key`(`whatsapp`),
    UNIQUE INDEX `Doctor_crm_key`(`crm`),
    UNIQUE INDEX `Doctor_rqe_key`(`rqe`),
    UNIQUE INDEX `Doctor_getStreamRef_key`(`getStreamRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccountVerification` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `verificationMethod` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `verifiedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guardianId` VARCHAR(191) NULL,
    `doctorId` VARCHAR(191) NULL,

    UNIQUE INDEX `AccountVerification_guardianId_key`(`guardianId`),
    UNIQUE INDEX `AccountVerification_doctorId_key`(`doctorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `id` VARCHAR(191) NOT NULL,
    `dependentId` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `getStreamChatId` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'CLOSED', 'PENDING') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Chat_getStreamChatId_key`(`getStreamChatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    UNIQUE INDEX `Admin_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `authToken` VARCHAR(512) NOT NULL,
    `resetToken` VARCHAR(512) NOT NULL,
    `authExpiry` DATETIME(3) NOT NULL,
    `resetExpiry` DATETIME(3) NOT NULL,
    `guardianId` VARCHAR(191) NULL,
    `doctorId` VARCHAR(191) NULL,
    `adminId` VARCHAR(191) NULL,
    `userType` ENUM('GUARDIAN', 'DEPENDENT', 'DOCTOR', 'ADMIN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Token_authToken_key`(`authToken`),
    UNIQUE INDEX `Token_resetToken_key`(`resetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordRecovery` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guardianId` VARCHAR(191) NULL,
    `doctorId` VARCHAR(191) NULL,
    `adminId` VARCHAR(191) NULL,
    `userType` ENUM('GUARDIAN', 'DEPENDENT', 'DOCTOR', 'ADMIN') NOT NULL,

    UNIQUE INDEX `PasswordRecovery_token_key`(`token`),
    UNIQUE INDEX `PasswordRecovery_guardianId_key`(`guardianId`),
    UNIQUE INDEX `PasswordRecovery_doctorId_key`(`doctorId`),
    UNIQUE INDEX `PasswordRecovery_adminId_key`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id` VARCHAR(191) NOT NULL,
    `level` VARCHAR(50) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `context` VARCHAR(250) NULL,
    `stack` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Version` (
    `id` VARCHAR(191) NOT NULL,
    `versionCode` VARCHAR(191) NOT NULL,
    `versionName` VARCHAR(191) NOT NULL,
    `requiredUpdate` BOOLEAN NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Version_versionCode_key`(`versionCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RiskSymptoms` ADD CONSTRAINT `RiskSymptoms_riskClassificationId_fkey` FOREIGN KEY (`riskClassificationId`) REFERENCES `RiskClassification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guardian` ADD CONSTRAINT `Guardian_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guardian` ADD CONSTRAINT `Guardian_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dependent` ADD CONSTRAINT `Dependent_guardianId_fkey` FOREIGN KEY (`guardianId`) REFERENCES `Guardian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dependent` ADD CONSTRAINT `Dependent_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountVerification` ADD CONSTRAINT `AccountVerification_guardianId_fkey` FOREIGN KEY (`guardianId`) REFERENCES `Guardian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountVerification` ADD CONSTRAINT `AccountVerification_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_dependentId_fkey` FOREIGN KEY (`dependentId`) REFERENCES `Dependent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_guardianId_fkey` FOREIGN KEY (`guardianId`) REFERENCES `Guardian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordRecovery` ADD CONSTRAINT `PasswordRecovery_guardianId_fkey` FOREIGN KEY (`guardianId`) REFERENCES `Guardian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordRecovery` ADD CONSTRAINT `PasswordRecovery_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordRecovery` ADD CONSTRAINT `PasswordRecovery_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
