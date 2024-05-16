import { z } from "zod";

export const productSchema = z.object({
    name: z.string(),
    price: z.number(),
    stock: z.number(),
    description: z.string(),
    categories: z.array(z.string()),
    brand: z.string(),
    images: z.array(z.string()),
});

export type ProductSchemaType = z.infer<typeof productSchema>;

export const ProductFilterSchema = z.object({
    minDiscount: z.string().optional(),
    maxDiscount: z.string().optional(),
    categoryIds: z.string().optional(),
    brandIds: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minRating: z.string().optional(),
    maxRating: z.string().optional(),
    searchQuery: z.string().optional(),
    brandName: z.string().optional(),
});

export type ProductFilterSchemaType = z.infer<typeof ProductFilterSchema>;
