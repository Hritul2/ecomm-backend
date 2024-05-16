/*
  Warnings:

  - Added the required column `AvgRating` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NumberOfRatings` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "AvgRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "NumberOfRatings" INTEGER NOT NULL;
