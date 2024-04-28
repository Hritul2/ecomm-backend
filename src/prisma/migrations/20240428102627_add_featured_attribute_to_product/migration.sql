/*
  Warnings:

  - Added the required column `DateUpdated` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "DateUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Featured" BOOLEAN NOT NULL DEFAULT false;
