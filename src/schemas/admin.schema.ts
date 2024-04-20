import { z } from "zod";

export const adminRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().min(10),
});

export type AdminRegisterSchemaType = z.infer<typeof adminRegisterSchema>;

export const adminLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
export type AdminLoginSchemaType = z.infer<typeof adminLoginSchema>;
