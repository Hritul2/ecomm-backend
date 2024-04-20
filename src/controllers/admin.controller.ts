import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../config/db.config";
import { hashPassword, compareHash } from "../helper/hashPassword";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../helper/tokenHelper";

import {
    adminRegisterSchema,
    AdminRegisterSchemaType,
} from "../schemas/admin.schema";
// registerAdmin

export const registerAdmin = asyncHandler(async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
    }: AdminRegisterSchemaType = adminRegisterSchema.parse(req.body);

    const hashedPassword = await hashPassword(password);
    const existingAdmin = await prisma.admin.findUnique({
        where: {
            Email: email,
        },
    });
    if (existingAdmin) {
        throw new ApiError(400, "Admin already exists");
    }
    const newAdmin = await prisma.admin.create({
        data: {
            Email: email,
            Password: hashedPassword,
            FirstName: firstName,
            LastName: lastName,
            PhoneNumber: phoneNumber,
        },
    });
    const sanitizeAdmin = {
        ...newAdmin,
        Password: undefined,
        AdminID: undefined,
    };
});
