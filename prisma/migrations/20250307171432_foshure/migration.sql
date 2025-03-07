/*
  Warnings:

  - A unique constraint covering the columns `[getStreamChatId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Chat_getStreamChatId_key` ON `Chat`(`getStreamChatId`);
