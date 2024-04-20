/*
  Warnings:

  - A unique constraint covering the columns `[PhoneNumber]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_PhoneNumber_key" ON "Admin"("PhoneNumber");
