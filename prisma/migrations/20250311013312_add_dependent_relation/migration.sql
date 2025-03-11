/*
  Warnings:

  - Added the required column `relationship` to the `Dependent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Dependent` ADD COLUMN `relationship` ENUM('PARENT', 'UNCLE', 'SIBLING', 'GRANDPARENT', 'OTHER') NOT NULL;
