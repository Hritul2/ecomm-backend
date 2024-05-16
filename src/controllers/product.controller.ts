import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../config/db.config";
import { calculateAvgRating } from "../helper/product.helper";
import { ProductFilterSchemaType } from "../schemas/product.schema";

// PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany();

    return res
        .status(201)
        .json(new ApiResponse(201, products, "Products fetched successfully"));
});
const getProductById = asyncHandler(async (req, res) => {
    const { prodId } = req.params;
    const product = await prisma.product.findUnique({
        where: { ProductID: parseInt(prodId) },
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product fetched successfully"));
});
const getProductByCategoryName = asyncHandler(async (req, res) => {
    // get categories from request query parameters
    const { catNames } = req.query;
    // convert category names to lowercase and split into an array
    const categoryNames = (catNames as string).toLowerCase().split(",");
    // find categories by name
    const categories = await prisma.category.findMany({
        where: {
            Name: {
                in: categoryNames,
            },
        },
    });
    // if categories do not exist, return 404
    if (categories.length === 0) {
        throw new ApiError(404, "Categories not found");
    }
    // get products by categories
    const productsOfCategories = await prisma.category.findMany({
        where: {
            CategoryID: {
                in: categories.map((category) => category.CategoryID),
            },
        },
        select: { Products: true },
    });
    if (!productsOfCategories) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                productsOfCategories,
                "Products fetched successfully"
            )
        );
});
const getProductByCategoryID = asyncHandler(async (req, res) => {
    const { catId } = req.params;
    // get products by category
    const productsOfCategory = await prisma.category.findFirst({
        where: { CategoryID: parseInt(catId) },
        select: { Products: true },
    });
    if (!productsOfCategory) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                productsOfCategory,
                "Products fetched successfully"
            )
        );
});
const getProductByBrandName = asyncHandler(async (req, res) => {
    const { brandName } = req.params;
    // check if brand exists
    const brand = await prisma.brand.findFirst({
        where: { Name: brandName.toLowerCase() },
    });
    // if brand does not exist, return 404
    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }
    // get products by brand
    const productsOfBrand = await prisma.brand.findFirst({
        where: { BrandID: brand.BrandID },
        select: { Products: true },
    });
    if (!productsOfBrand) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                productsOfBrand,
                "Products fetched successfully"
            )
        );
});
const getProductByBrandID = asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    // get products by brand
    const productsOfBrand = await prisma.brand.findFirst({
        where: { BrandID: parseInt(brandId) },
        select: { Products: true },
    });
    if (!productsOfBrand) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                productsOfBrand,
                "Products fetched successfully"
            )
        );
});
const getProductByPriceRange = asyncHandler(async (req, res) => {
    const { minPrice, maxPrice } = req.params;
    // get products by price range
    const products = await prisma.product.findMany({
        where: {
            AND: [
                { Price: { gte: parseInt(minPrice) } },
                { Price: { lte: parseInt(maxPrice) } },
            ],
        },
    });
    if (!products) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, products, "Products fetched successfully"));
});
const getProductByRatingRange = asyncHandler(async (req, res) => {
    const { minRating, maxRating } = req.params;
    // get products by rating
    const products = await prisma.product.findMany({
        where: {
            AND: [
                { AvgRating: { gte: parseInt(minRating) } },
                { AvgRating: { lte: parseInt(maxRating) } },
            ],
        },
    });
    if (!products) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, products, "Products fetched successfully"));
});
const getProductBySearch = asyncHandler(async (req, res) => {
    const { searchQuery } = req.params;
    // get products by search query
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { Name: { contains: searchQuery, mode: "insensitive" } },
                { Description: { contains: searchQuery, mode: "insensitive" } },
            ],
        },
    });
    if (!products) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, products, "Products fetched successfully"));
});
const getTopRatedProducts = asyncHandler(async (req, res) => {
    // Calculate average ratings for each product
    const productsWithAvgRatings = await prisma.product.findMany({
        include: {
            Reviews: {
                select: {
                    Rating: true,
                },
            },
        },
    });

    // Calculate average rating for each product
    const productsWithAverageRatings = productsWithAvgRatings.map(
        (product) => ({
            ...product,
            avgRating: calculateAvgRating(product.Reviews),
        })
    );

    // Sort products by average rating
    productsWithAverageRatings.sort((a, b) => b.avgRating - a.avgRating);

    const products = productsWithAverageRatings.map((product) => ({
        ...product,
        // Remove reviews to avoid unnecessary data transfer
        Reviews: undefined,
    }));

    return res
        .status(201)
        .json(new ApiResponse(201, products, "Products fetched successfully"));
});
const getNewArrivals = asyncHandler(async (req, res) => {
    // get products by date added
    const products = await prisma.product.findMany({
        orderBy: { DateAdded: "desc" },
    });
    if (!products) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, products, "Products fetched successfully"));
});
const getFeaturedProducts = asyncHandler(async (req, res) => {
    // get products by featured
    const products = await prisma.product.findMany({
        where: { Featured: true },
    });
    if (!products) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, products, "Products fetched successfully"));
});
const getRecommendedProducts = asyncHandler(async (req, res) => {
    // get products by recommended
    const products = await prisma.product.findMany({
        where: { Recommended: true },
    });
    if (!products) {
        throw new ApiError(404, "Products not found");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, products, "Products fetched successfully"));
});
const getRelatedProducts = asyncHandler(async (req, res) => {
    const { prodId } = req.params;
    const product = await prisma.product.findUnique({
        where: { ProductID: parseInt(prodId) },
        include: {
            Category: true, // Include associated categories
        },
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Extract category IDs from product's categories
    const categoryIds = product.Category.map((pc) => pc.CategoryID);

    // Find products that belong to any of these categories
    const relatedProducts = await prisma.product.findMany({
        where: {
            Category: {
                some: {
                    CategoryID: {
                        in: categoryIds,
                    },
                },
            },
            // Exclude the current product
            NOT: {
                ProductID: parseInt(prodId),
            },
        },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                relatedProducts,
                "Related products fetched successfully"
            )
        );
});
const getProductByDiscount = asyncHandler(async (req, res) => {
    const { discountCode } = req.params;

    // Find the discount with the provided code
    const discount = await prisma.discount.findUnique({
        where: { Code: discountCode },
    });

    if (!discount) {
        throw new ApiError(404, "Discount not found");
    }

    // Get all product discount records associated with this discount code
    const productDiscounts = await prisma.productDiscount.findMany({
        where: { DiscountID: discount.DiscountID },
        include: { Product: true }, // Include associated products
    });

    // Extract product IDs from product discount records
    const productIds = productDiscounts.map((pd) => pd.ProductID);

    // Find products that have discounts associated with the provided code
    const products = await prisma.product.findMany({
        where: { ProductID: { in: productIds } },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                products,
                "Products with the given discount fetched successfully"
            )
        );
});

// CATEGORY
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany();

    return res
        .status(201)
        .json(
            new ApiResponse(201, categories, "Categories fetched successfully")
        );
});

// BRAND
const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await prisma.brand.findMany();

    return res
        .status(201)
        .json(new ApiResponse(201, brands, "Brands fetched successfully"));
});

// REVIEW
const getProductReviews = asyncHandler(async (req, res) => {
    const { prodId } = req.params;
    const product = await prisma.product.findUnique({
        where: { ProductID: parseInt(prodId) },
        include: { Reviews: true },
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                product.Reviews,
                "Product reviews fetched successfully"
            )
        );
});

// FILTERS
const getProductByFilter = asyncHandler(async (req, res) => {
    const {
        categoryIds,
        brandIds,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
        searchQuery,
        minDiscount,
        maxDiscount,
        brandName,
    }: ProductFilterSchemaType = req.query;

    let filters: any = {};

    if (categoryIds) {
        filters.CategoryID = {
            in: categoryIds.split(","),
        };
    }

    if (brandIds) {
        filters.BrandID = {
            in: brandIds.split(","),
        };
    }

    if (minPrice && maxPrice) {
        filters.Price = {
            gte: parseInt(minPrice),
            lte: parseInt(maxPrice),
        };
    }
    if (minRating && maxRating) {
        filters.AvgRating = {
            gte: parseInt(minRating),
            lte: parseInt(maxRating),
        };
    }
    if (minDiscount && maxDiscount) {
        filters.Discount = {
            gte: parseInt(minDiscount),
            lte: parseInt(maxDiscount),
        };
    }
    if (searchQuery) {
        filters.OR = [
            { Name: { contains: searchQuery, mode: "insensitive" } },
            { Description: { contains: searchQuery, mode: "insensitive" } },
        ];
    }

    if (brandName) {
        const brand = await prisma.brand.findFirst({
            where: {
                Name: brandName.toLowerCase(),
            },
        });
        if (!brand) {
            throw new ApiError(404, "Brand not found");
        }
        filters.BrandID = brand.BrandID;
    }
    const products = await prisma.product.findMany({
        where: filters,
    });

    if (!products || products.length === 0) {
        throw new ApiError(404, "Products not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                products,
                "Products fetched successfully with applied filters"
            )
        );
});

// EXPORTS
export {
    getAllProducts,
    getProductById,
    getAllBrands,
    getAllCategories,
    getProductByCategoryName,
    getProductByCategoryID,
    getProductByBrandName,
    getProductByBrandID,
    getProductByPriceRange,
    getProductByRatingRange,
    getProductBySearch,
    getTopRatedProducts,
    getNewArrivals,
    getFeaturedProducts,
    getRecommendedProducts,
    getRelatedProducts,
    getProductByDiscount,
    getProductReviews,
    getProductByFilter,
};
