/*
  Warnings:

  - The primary key for the `OrderProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `ProductID` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `ProductID` on the `CartItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ProductID` on the `OrderProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ProductID` on the `ProductCategory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ProductID` on the `ProductDiscount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ProductID` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_ProductID_fkey";

-- DropForeignKey
ALTER TABLE "OrderProduct" DROP CONSTRAINT "OrderProduct_ProductID_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_ProductID_fkey";

-- DropForeignKey
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_ProductID_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_ProductID_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "ProductID",
ADD COLUMN     "ProductID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderProduct" DROP CONSTRAINT "OrderProduct_pkey",
DROP COLUMN "ProductID",
ADD COLUMN     "ProductID" INTEGER NOT NULL,
ADD CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("OrderID", "ProductID");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "ProductID",
ADD COLUMN     "ProductID" SERIAL NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("ProductID");

-- AlterTable
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_pkey",
DROP COLUMN "ProductID",
ADD COLUMN     "ProductID" INTEGER NOT NULL,
ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("ProductID", "CategoryID");

-- AlterTable
ALTER TABLE "ProductDiscount" DROP COLUMN "ProductID",
ADD COLUMN     "ProductID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "ProductID",
ADD COLUMN     "ProductID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductDiscount_ProductID_DiscountID_key" ON "ProductDiscount"("ProductID", "DiscountID");

-- CreateIndex
CREATE UNIQUE INDEX "Review_UserID_ProductID_key" ON "Review"("UserID", "ProductID");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDiscount" ADD CONSTRAINT "ProductDiscount_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;
