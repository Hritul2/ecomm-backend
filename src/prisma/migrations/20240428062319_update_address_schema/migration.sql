/*
  Warnings:

  - You are about to drop the column `DelliveryPhone` on the `Address` table. All the data in the column will be lost.
  - Added the required column `DeliveryPhone` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Made the column `FirstLine` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "DelliveryPhone",
ADD COLUMN     "DeliveryPhone" TEXT NOT NULL,
ALTER COLUMN "FirstLine" SET NOT NULL;
