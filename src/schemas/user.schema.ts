// user.schema.ts
import { z } from "zod";

export const userSchema = z
    .object({
        UserID: z.string(),
        Email: z.string().email(),
        FirstName: z.string(),
        LastName: z.string().optional(),
    })
    .strict();

export type User = z.infer<typeof userSchema>;
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

// forgot password schema
export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
