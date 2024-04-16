## Routes

### User Authentication:

-   **/register**
    -   POST: Register a new user
-   **/login**
    -   POST: User login
-   **/logout**
    -   POST: User logout
-   **/forgot-password**
    -   POST: Request password reset
-   **/reset-password**
    -   POST: Reset password

### User Profile:

-   **/profile**
    -   GET: View user profile
    -   PUT: Update user profile
-   **/orders**
    -   GET: List user's orders
-   **/wishlist**
    -   GET: View user's wishlist
    -   POST: Add product to wishlist
    -   DELETE: Remove product from wishlist
-   **/address**
    -   GET: List user's addresses
    -   POST: Add new address
    -   PUT: Update address
    -   DELETE: Delete address
-   **/payment-methods**
    -   GET: List user's payment methods
    -   POST: Add new payment method
    -   PUT: Update payment method
    -   DELETE: Delete payment method

### Product Catalog:

-   **/products**
    -   GET: List all products with filters (category, brand, price range, etc.)
-   **/products/{id}**
    -   GET: View details of a specific product
-   **/categories**
    -   GET: List all product categories
-   **/brands**
    -   GET: List all brands

### Shopping Cart:

-   **/cart**
    -   GET: View shopping cart
    -   POST: Add product to cart
    -   PUT: Update product quantity in cart
    -   DELETE: Remove product from cart
-   **/cart/add**
    -   POST: Add product to cart
-   **/cart/remove**
    -   DELETE: Remove product from cart
-   **/cart/update**
    -   PUT: Update product quantity in cart

### Checkout:

-   **/checkout**
    -   POST: Initiate checkout process
-   **/checkout/payment**
    -   POST: Payment processing
-   **/checkout/success**
    -   GET: Order confirmation

### Order Management (Admin):

-   **/admin/orders**
    -   GET: List all orders
-   **/admin/orders/{id}**
    -   GET: View details of a specific order
-   **/admin/orders/{id}/update**
    -   PUT: Update order status

### Inventory Management (Admin):

-   **/admin/products**
    -   GET: List all products
-   **/admin/products/add**
    -   POST: Add new product
-   **/admin/products/{id}/update**
    -   PUT: Update product details
-   **/admin/inventory**
    -   PUT: Manage product inventory

### Reviews and Ratings:

-   **/products/{id}/reviews**
    -   GET: List all reviews for a product
-   **/products/{id}/reviews/add**
    -   POST: Add review for a product

### Search and Recommendations:

-   **/search**
    -   GET: Product search functionality
-   **/recommendations**
    -   GET: Product recommendations based on user behavior

### Content Management (Admin):

-   **/admin/content**
    -   GET: List all static content
    -   POST: Add new static content
    -   PUT: Update static content
    -   DELETE: Delete static content
-   **/pages/{slug}**
    -   GET: Display static pages (About Us, Contact, etc.)

### Data Models:

1. **User**:

    - UserID (Primary Key)
    - Email (Unique)
    - Password (hashed)
    - FirstName
    - LastName
    - AddressID (Reference)
    - PaymentMethods (Array of PaymentMethodIDs)
    - Orders (Array of OrderIDs)
    - Wishlist (Array of ProductIDs)
    - RoleID (Reference)

2. **Admin**:

    - AdminID (Primary Key)
    - UserID (Reference)

3. **Product**:

    - ProductID (Primary Key)
    - Name
    - Description
    - Price
    - CategoryID (Reference)
    - BrandID (Reference)
    - Inventory
    - Images (Array)
    - Reviews (Array of ReviewIDs)

4. **Order**:

    - OrderID (Primary Key)
    - UserID (Reference)
    - Products (Array of ProductIDs with quantities)
    - TotalPrice
    - ShippingAddressID (Reference)
    - PaymentMethodID (Reference)
    - OrderStatus

5. **Review**:

    - ReviewID (Primary Key)
    - ProductID (Reference)
    - UserID (Reference)
    - Rating
    - Comment
    - Date

6. **Category**:

    - CategoryID (Primary Key)
    - Name
    - Description
    - ParentCategoryID (Reference, Optional)

7. **Brand**:

    - BrandID (Primary Key)
    - Name
    - Description
    - Logo (Image)

8. **Cart**:

    - CartID (Primary Key)
    - UserID (Reference)
    - Products (Array of ProductIDs with quantities)

9. **PaymentMethod**:

    - PaymentMethodID (Primary Key)
    - UserID (Reference)
    - Type (Credit Card, PayPal, etc.)
    - Details

10. **Address**:

-   AddressID (Primary Key)
-   UserID (Reference)
-   Street
-   City
-   State
-   ZipCode
-   Country
-   Type (Shipping, Billing)

11. **Role**:

-   RoleID (Primary Key)
-   Name (Admin, User)

### Relationships:

-   A **User** can have multiple **PaymentMethods**, **Orders**, and **Wishlist** items.
-   A **Product** belongs to one **Category** and one **Brand**.
-   An **Order** is associated with one **User**, one **ShippingAddress**, and one **PaymentMethod**.
-   A **Review** is associated with one **Product** and one **User**.
-   A **Category** can have multiple child categories and belongs to one parent category (optional).
-   A **Brand** can have multiple products.
-   A **Cart** is associated with one **User**.
-   A **PaymentMethod** is associated with one **User**.
-   An **Address** is associated with one **User**.
-   A **Role** can have multiple **Users**.

This refined model provides a more comprehensive and relevant structure for an e-commerce website, including an admin role and properly defined relationships between entities.

Here's the directory structure:

```
src/
|-- config/
|   |-- database.ts           # Database connection setup (using Prisma)
|
|-- middleware/
|   |-- authentication.ts     # Middleware for user authentication
|
|-- routes/
|   |-- userAuthentication/
|   |   |-- register.ts       # User registration route
|   |   |-- login.ts          # User login route
|   |   |-- logout.ts         # User logout route
|   |   |-- forgotPassword.ts # Forgot password route
|   |   |-- resetPassword.ts  # Reset password route
|   |
|   |-- userProfile/
|   |   |-- profile.ts        # View and edit user profile
|   |   |-- orders.ts         # View user's orders
|   |   |-- wishlist.ts       # Manage user's wishlist
|   |   |-- address.ts        # Manage user's shipping addresses
|   |   |-- paymentMethods.ts # Manage user's payment methods
|   |
|   |-- productCatalog/
|   |   |-- products.ts       # List all products and view specific product
|   |   |-- categories.ts     # List all product categories
|   |   |-- brands.ts         # List all brands
|   |
|   |-- shoppingCart/
|   |   |-- cart.ts           # View and manage shopping cart
|   |   |-- cartActions.ts    # Add, remove, update products in cart
|   |
|   |-- checkout/
|   |   |-- checkout.ts       # Initiate and manage checkout process
|   |   |-- payment.ts        # Payment processing
|   |   |-- success.ts        # Order confirmation
|   |
|   |-- orderManagement/
|   |   |-- orders.ts         # List all orders and view specific order
|   |   |-- orderActions.ts   # Update order status (admin)
|   |
|   |-- inventoryManagement/
|   |   |-- products.ts       # List all products (admin)
|   |   |-- productActions.ts # Add, update, manage product inventory (admin)
|   |
|   |-- reviewsAndRatings/
|   |   |-- reviews.ts        # List all reviews for a product and add review
|   |
|   |-- searchAndRecommendations/
|   |   |-- search.ts         # Product search functionality
|   |   |-- recommendations.ts # Product recommendations based on user behavior
|   |
|   |-- contentManagement/
|   |   |-- staticContent.ts  # Manage static content (admin)
|   |   |-- pages.ts          # Display static pages (About Us, Contact, etc.)
|
|-- models/
|   |-- user.prisma           # User model
|   |-- product.prisma        # Product model
|   |-- order.prisma          # Order model
|   |-- review.prisma         # Review model
|   |-- category.prisma       # Category model
|   |-- brand.prisma          # Brand model
|   |-- cart.prisma           # Cart model
|   |-- paymentMethod.prisma  # PaymentMethod model
|   |-- address.prisma        # Address model
|
|-- schema/
|   |-- user.ts               # Type validation for User model
|   |-- product.ts            # Type validation for Product model
|   |-- order.ts              # Type validation for Order model
|   |-- review.ts             # Type validation for Review model
|   |-- category.ts           # Type validation for Category model
|   |-- brand.ts              # Type validation for Brand model
|   |-- cart.ts               # Type validation for Cart model
|   |-- paymentMethod.ts      # Type validation for PaymentMethod model
|   |-- address.ts            # Type validation for Address model
|
|-- utils/
|   |-- helpers.ts            # Helper functions (e.g., password hashing, etc.)
|
|-- prisma/
|   |-- schema.prisma         # Prisma schema file (importing individual model files)
|
|-- app.ts                    # Main application file
|-- server.ts                 # Server setup and start file
```

In this structure:

-   The `config` folder contains the database configuration.
-   The `middleware` folder houses authentication middleware.
-   The `routes` folder organizes the API routes based on functionalities.
-   The `models` folder contains the Prisma model files corresponding to your database tables.
-   The `schema` folder includes TypeScript files for type validation based on your Prisma models.
-   The `utils` folder contains utility functions.
-   The `prisma` folder holds the Prisma schema file, which imports individual model files.

You can adjust this structure based on your project's specific needs and preferences. This structure aims to keep the project organized and maintainable, grouping related functionalities and files together.
