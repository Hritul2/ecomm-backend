/*
  Warnings:

  - You are about to drop the column `RefreshTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "RefreshTokenExpiry",
DROP COLUMN "isAdmin";

-- CreateTable
CREATE TABLE "Admin" (
    "AdminID" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "PhoneNumber" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "RefreshToken" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_Email_key" ON "Admin"("Email");

-- CreateIndex
CREATE INDEX "Admin_Email_idx" ON "Admin"("Email");
