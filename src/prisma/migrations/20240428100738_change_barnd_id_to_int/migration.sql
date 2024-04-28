/*
  Warnings:

  - The primary key for the `Brand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `BrandID` column on the `Brand` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `BrandID` on the `BrandDiscount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `BrandID` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "BrandDiscount" DROP CONSTRAINT "BrandDiscount_BrandID_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_BrandID_fkey";

-- AlterTable
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_pkey",
DROP COLUMN "BrandID",
ADD COLUMN     "BrandID" SERIAL NOT NULL,
ADD CONSTRAINT "Brand_pkey" PRIMARY KEY ("BrandID");

-- AlterTable
ALTER TABLE "BrandDiscount" DROP COLUMN "BrandID",
ADD COLUMN     "BrandID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "BrandID",
ADD COLUMN     "BrandID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BrandDiscount_BrandID_DiscountID_key" ON "BrandDiscount"("BrandID", "DiscountID");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_BrandID_fkey" FOREIGN KEY ("BrandID") REFERENCES "Brand"("BrandID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandDiscount" ADD CONSTRAINT "BrandDiscount_BrandID_fkey" FOREIGN KEY ("BrandID") REFERENCES "Brand"("BrandID") ON DELETE RESTRICT ON UPDATE CASCADE;
