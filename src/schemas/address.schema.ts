import z from "zod";

export const addressSchema = z.object({
    firstLine: z.string(),
    secondLine: z.string().optional(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pinconde: z.number().min(6).max(6),
    addressFor: z.string(),
    deliveryPhone: z.string().min(10).max(14),
});

export type AddressSchemaType = z.infer<typeof addressSchema>;
