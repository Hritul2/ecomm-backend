// user.controller.ts
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { registerUserSchema, RegisterUser } from "../schemas/user.schema";
import { hashPassword } from "../helper/hashPassword";
const prisma = new PrismaClient();

// Register new user
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password }: RegisterUser =
        registerUserSchema.parse(req.body);

    console.log(firstName, lastName, email, password);
    // check if user already exists
    const user = await prisma.user.findUnique({
        where: {
            Email: email,
        },
    });

    if (user) {
        return res.status(400).json(new ApiError(400, "User already exists"));
    } else {
        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Password: hashedPassword,
            },
        });
        newUser.Password = "";
        const respose = new ApiResponse(
            201,
            newUser,
            "User created successfully"
        );
        return res.status(respose.statusCode).json(respose);
    }
});

export { registerUser };
