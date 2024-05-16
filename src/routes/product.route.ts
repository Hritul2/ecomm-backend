import { Router } from "express";
const router = Router();

import {
    getAllProducts,
    getProductByCategoryName,
    getProductById,
    getAllBrands,
    getAllCategories,
    getFeaturedProducts,
    getNewArrivals,

    // Ugly Routes
    // getProductByBrandID,
    // getProductByBrandName,
    // getProductByCategoryID,
    // getProductByDiscount,
    // getProductByPriceRange,
    // getProductByRatingRange,
    // getProductBySearch,
    getProductReviews,
    getRecommendedProducts,
    getRelatedProducts,
    getTopRatedProducts,
    getProductByFilter,
} from "../controllers/product.controller";

// PRODUCT ROUTES
router.get("/", getAllProducts); // Get all products
router.get("/categories", getAllCategories); // Get all categories
router.get("/brands", getAllBrands); // Get all brands
router.get("/product/:productId", getProductById); // Get product by ID
router.get("/featured", getFeaturedProducts); // Get featured products
router.get("/new-arrivals", getNewArrivals); // Get new arrivals
router.get("/reviews/:productId", getProductReviews); // Get product reviews
router.get("/recommended/:productId", getRecommendedProducts); // Get recommended products
router.get("/related/:productId", getRelatedProducts); // Get related products
router.get("/top-rated", getTopRatedProducts); // Get top rated products
router.post("/filter", getProductByFilter); // Get products by filter

// // Ugly Routes
// router.get("/category/:categoryName", getProductByCategoryName); // Get products by category name
// router.get("/brand/:brandId", getProductByBrandID); // Get products by brand ID
// router.get("/brand-name/:brandName", getProductByBrandName); // Get products by brand name
// router.get("/category-id/:categoryId", getProductByCategoryID); // Get products by category ID
// router.get("/discount/:discount", getProductByDiscount); // Get products by discount
// router.get("/price-range/:minPrice/:maxPrice", getProductByPriceRange); // Get products by price range
// router.get("/rating-range/:minRating/:maxRating", getProductByRatingRange); // Get products by rating range
// router.get("/search/:searchQuery", getProductBySearch); // Get products by search query

export default router;
