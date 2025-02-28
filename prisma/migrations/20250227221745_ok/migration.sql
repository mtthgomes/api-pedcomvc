/*
  Warnings:

  - Added the required column `passwordHash` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "passwordHash" TEXT NOT NULL;
