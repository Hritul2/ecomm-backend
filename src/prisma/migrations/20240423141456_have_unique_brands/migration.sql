/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Brand_Name_key" ON "Brand"("Name");
