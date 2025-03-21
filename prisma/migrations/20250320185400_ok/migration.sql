/*
  Warnings:

  - A unique constraint covering the columns `[versionCode]` on the table `Version` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Version_versionCode_key` ON `Version`(`versionCode`);
