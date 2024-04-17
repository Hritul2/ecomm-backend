// user.schema.ts
import { z } from "zod";

// user register schema
export const registerUserSchema = z
    .object({
        firstName: z.string().min(2),
        lastName: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8),
    })
    .strict();

export type RegisterUser = z.infer<typeof registerUserSchema>;

// login user schema

export const loginUserSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
    })
    .strict();

export type LoginUser = z.infer<typeof loginUserSchema>;
