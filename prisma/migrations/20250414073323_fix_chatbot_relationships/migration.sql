/*
  Warnings:

  - You are about to drop the column `projectId` on the `Chatbot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chatbot" DROP CONSTRAINT "Chatbot_projectId_fkey";

-- AlterTable
ALTER TABLE "Chatbot" DROP COLUMN "projectId";
