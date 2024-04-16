-- CreateTable
CREATE TABLE "User" (
    "UserID" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Address" (
    "AddressID" TEXT NOT NULL,
    "FirstLine" TEXT,
    "SecondLine" TEXT,
    "Street" TEXT,
    "City" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "Country" TEXT NOT NULL DEFAULT 'India',
    "Pincode" INTEGER NOT NULL,
    "AddressFor" TEXT NOT NULL,
    "DelliveryPhone" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("AddressID")
);

-- CreateTable
CREATE TABLE "Order" (
    "OrderID" TEXT NOT NULL,
    "TotalAmount" DOUBLE PRECISION NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Status" TEXT NOT NULL DEFAULT 'Pending',
    "UserID" TEXT NOT NULL,
    "DestinationAddressID" TEXT NOT NULL,
    "BillID" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("OrderID")
);

-- CreateTable
CREATE TABLE "Bill" (
    "BillID" TEXT NOT NULL,
    "TotalAmount" DOUBLE PRECISION NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "PaymentMethod" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,
    "BillingAddressID" TEXT NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("BillID")
);

-- CreateTable
CREATE TABLE "Product" (
    "ProductID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Image" TEXT[],
    "Inventory" INTEGER NOT NULL,
    "BrandID" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("ProductID")
);

-- CreateTable
CREATE TABLE "Cart" (
    "CartID" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,
    "TotalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("CartID")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "CartItemID" TEXT NOT NULL,
    "CartID" TEXT NOT NULL,
    "ProductID" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("CartItemID")
);

-- CreateTable
CREATE TABLE "Category" (
    "CategoryID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "ProductID" TEXT NOT NULL,
    "CategoryID" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("ProductID","CategoryID")
);

-- CreateTable
CREATE TABLE "OrderProduct" (
    "OrderID" TEXT NOT NULL,
    "ProductID" TEXT NOT NULL,

    CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("OrderID","ProductID")
);

-- CreateTable
CREATE TABLE "Brand" (
    "BrandID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("BrandID")
);

-- CreateTable
CREATE TABLE "Review" (
    "ReviewID" TEXT NOT NULL,
    "ProductID" TEXT NOT NULL,
    "Rating" INTEGER NOT NULL,
    "Review" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "UserID" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("ReviewID")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "WishlistID" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("WishlistID")
);

-- CreateTable
CREATE TABLE "Discount" (
    "DiscountID" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Percentage" DOUBLE PRECISION NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("DiscountID")
);

-- CreateTable
CREATE TABLE "CategoryDiscount" (
    "CategoryDiscountID" TEXT NOT NULL,
    "CategoryID" TEXT NOT NULL,
    "DiscountID" TEXT NOT NULL,

    CONSTRAINT "CategoryDiscount_pkey" PRIMARY KEY ("CategoryDiscountID")
);

-- CreateTable
CREATE TABLE "ProductDiscount" (
    "ProductDiscountID" TEXT NOT NULL,
    "ProductID" TEXT NOT NULL,
    "DiscountID" TEXT NOT NULL,

    CONSTRAINT "ProductDiscount_pkey" PRIMARY KEY ("ProductDiscountID")
);

-- CreateTable
CREATE TABLE "BrandDiscount" (
    "BrandDiscountID" TEXT NOT NULL,
    "BrandID" TEXT NOT NULL,
    "DiscountID" TEXT NOT NULL,

    CONSTRAINT "BrandDiscount_pkey" PRIMARY KEY ("BrandDiscountID")
);

-- CreateTable
CREATE TABLE "UserDiscountUsage" (
    "UserDiscountUsageID" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,
    "DiscountID" TEXT NOT NULL,
    "UsedCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserDiscountUsage_pkey" PRIMARY KEY ("UserDiscountUsageID")
);

-- CreateTable
CREATE TABLE "DiscountHistory" (
    "DiscountHistoryID" TEXT NOT NULL,
    "DiscountCode" TEXT NOT NULL,
    "DiscountAmount" DOUBLE PRECISION NOT NULL,
    "AppliedDate" TIMESTAMP(3) NOT NULL,
    "BillID" TEXT NOT NULL,
    "DiscountID" TEXT NOT NULL,

    CONSTRAINT "DiscountHistory_pkey" PRIMARY KEY ("DiscountHistoryID")
);

-- CreateTable
CREATE TABLE "_ProductToWishlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE INDEX "User_Email_idx" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Address_UserID_key" ON "Address"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Order_BillID_key" ON "Order"("BillID");

-- CreateIndex
CREATE INDEX "Order_OrderID_UserID_idx" ON "Order"("OrderID", "UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Order_OrderID_key" ON "Order"("OrderID");

-- CreateIndex
CREATE INDEX "Bill_UserID_idx" ON "Bill"("UserID");

-- CreateIndex
CREATE INDEX "Product_Name_idx" ON "Product"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_UserID_key" ON "Cart"("UserID");

-- CreateIndex
CREATE INDEX "Category_Name_idx" ON "Category"("Name");

-- CreateIndex
CREATE INDEX "Brand_Name_idx" ON "Brand"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Review_UserID_ProductID_key" ON "Review"("UserID", "ProductID");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_UserID_key" ON "Wishlist"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_Code_key" ON "Discount"("Code");

-- CreateIndex
CREATE INDEX "Discount_Code_idx" ON "Discount"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryDiscount_CategoryID_DiscountID_key" ON "CategoryDiscount"("CategoryID", "DiscountID");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDiscount_ProductID_DiscountID_key" ON "ProductDiscount"("ProductID", "DiscountID");

-- CreateIndex
CREATE UNIQUE INDEX "BrandDiscount_BrandID_DiscountID_key" ON "BrandDiscount"("BrandID", "DiscountID");

-- CreateIndex
CREATE UNIQUE INDEX "UserDiscountUsage_UserID_DiscountID_key" ON "UserDiscountUsage"("UserID", "DiscountID");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToWishlist_AB_unique" ON "_ProductToWishlist"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToWishlist_B_index" ON "_ProductToWishlist"("B");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_DestinationAddressID_fkey" FOREIGN KEY ("DestinationAddressID") REFERENCES "Address"("AddressID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_BillID_fkey" FOREIGN KEY ("BillID") REFERENCES "Bill"("BillID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_BillingAddressID_fkey" FOREIGN KEY ("BillingAddressID") REFERENCES "Address"("AddressID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_BrandID_fkey" FOREIGN KEY ("BrandID") REFERENCES "Brand"("BrandID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_CartID_fkey" FOREIGN KEY ("CartID") REFERENCES "Cart"("CartID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Order"("OrderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryDiscount" ADD CONSTRAINT "CategoryDiscount_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryDiscount" ADD CONSTRAINT "CategoryDiscount_DiscountID_fkey" FOREIGN KEY ("DiscountID") REFERENCES "Discount"("DiscountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDiscount" ADD CONSTRAINT "ProductDiscount_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDiscount" ADD CONSTRAINT "ProductDiscount_DiscountID_fkey" FOREIGN KEY ("DiscountID") REFERENCES "Discount"("DiscountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandDiscount" ADD CONSTRAINT "BrandDiscount_BrandID_fkey" FOREIGN KEY ("BrandID") REFERENCES "Brand"("BrandID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandDiscount" ADD CONSTRAINT "BrandDiscount_DiscountID_fkey" FOREIGN KEY ("DiscountID") REFERENCES "Discount"("DiscountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDiscountUsage" ADD CONSTRAINT "UserDiscountUsage_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDiscountUsage" ADD CONSTRAINT "UserDiscountUsage_DiscountID_fkey" FOREIGN KEY ("DiscountID") REFERENCES "Discount"("DiscountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountHistory" ADD CONSTRAINT "DiscountHistory_BillID_fkey" FOREIGN KEY ("BillID") REFERENCES "Bill"("BillID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountHistory" ADD CONSTRAINT "DiscountHistory_DiscountID_fkey" FOREIGN KEY ("DiscountID") REFERENCES "Discount"("DiscountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToWishlist" ADD CONSTRAINT "_ProductToWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("ProductID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToWishlist" ADD CONSTRAINT "_ProductToWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "Wishlist"("WishlistID") ON DELETE CASCADE ON UPDATE CASCADE;
