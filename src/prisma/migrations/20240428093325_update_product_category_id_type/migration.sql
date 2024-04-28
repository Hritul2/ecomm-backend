/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `CategoryID` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `CategoryID` on the `CategoryDiscount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `CategoryID` on the `ProductCategory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CategoryDiscount" DROP CONSTRAINT "CategoryDiscount_CategoryID_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_CategoryID_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "CategoryID",
ADD COLUMN     "CategoryID" SERIAL NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryID");

-- AlterTable
ALTER TABLE "CategoryDiscount" DROP COLUMN "CategoryID",
ADD COLUMN     "CategoryID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_pkey",
DROP COLUMN "CategoryID",
ADD COLUMN     "CategoryID" INTEGER NOT NULL,
ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("ProductID", "CategoryID");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryDiscount_CategoryID_DiscountID_key" ON "CategoryDiscount"("CategoryID", "DiscountID");

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryDiscount" ADD CONSTRAINT "CategoryDiscount_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;
