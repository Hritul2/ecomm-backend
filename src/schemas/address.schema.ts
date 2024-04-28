import { z } from "zod";

export const addressSchema = z.object({
    firstLine: z.string(),
    secondLine: z.string().optional(),
    street: z.string().optional(),
    city: z.string(),
    state: z.string(),
    country: z.string().default("India"),
    pincode: z.string().min(6).max(6),
    addressFor: z.string(),
    deliveryPhone: z.string().refine((value) => /^\d{10}$/.test(value), {
        message:
            "Phone number must be a 10-digit string containing only numbers",
    }),
});

export type AddressSchemaType = z.infer<typeof addressSchema>;
