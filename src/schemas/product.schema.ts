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
