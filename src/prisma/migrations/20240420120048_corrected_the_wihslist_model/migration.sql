/*
  Warnings:

  - You are about to drop the `WishlistProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `WishlistID` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WishlistProduct" DROP CONSTRAINT "WishlistProduct_ProductID_fkey";

-- DropForeignKey
ALTER TABLE "WishlistProduct" DROP CONSTRAINT "WishlistProduct_WishlistID_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "WishlistID" TEXT NOT NULL;

-- DropTable
DROP TABLE "WishlistProduct";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_WishlistID_fkey" FOREIGN KEY ("WishlistID") REFERENCES "Wishlist"("WishlistID") ON DELETE RESTRICT ON UPDATE CASCADE;
