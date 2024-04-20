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
    adminLoginSchema,
    AdminLoginSchemaType,
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
            Email: email.toLowerCase(),
        },
    });
    if (existingAdmin) {
        throw new ApiError(400, "Admin already exists");
    }
    const newAdmin = await prisma.admin.create({
        data: {
            Email: email.toLowerCase(),
            Password: hashedPassword,
            FirstName: firstName.toLowerCase(),
            LastName: lastName.toLowerCase(),
            PhoneNumber: phoneNumber,
        },
    });
    const sanitizeAdmin = {
        ...newAdmin,
        Password: undefined,
        AdminID: undefined,
    };
    return res
        .status(201)
        .json(
            new ApiResponse(201, sanitizeAdmin, "Admin registered successfully")
        );
});

// loginAdmin
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password }: AdminLoginSchemaType = adminLoginSchema.parse(
        req.body
    );
    const admin = await prisma.admin.findUnique({
        where: {
            Email: email.toLowerCase(),
        },
    });
    if (!admin) {
        throw new ApiError(400, "Invalid email or password");
    }
    const isPasswordValid = await compareHash(password, admin.Password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }
    const accessToken = generateAccessToken({
        userID: admin.AdminID,
        email: admin.Email,
    });
    const refreshToken = generateRefreshToken({ userID: admin.AdminID });

    const hashedRefreshToken = await hashPassword(refreshToken);
    await prisma.admin.update({
        where: {
            AdminID: admin.AdminID,
        },
        data: {
            RefreshToken: hashedRefreshToken,
        },
    });
    const cookieOptions = {
        httpOnly: true,
        //secure: false, //true in production
        //sameSite: "strict",
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
    return res.status(200).json(new ApiResponse(200, null, "Login successful"));
});

// get all adimins

export const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await prisma.admin.findMany();
    return res.status(200).json(new ApiResponse(200, admins, "All Admins"));
});
