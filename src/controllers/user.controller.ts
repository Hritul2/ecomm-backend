import { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../config/db.config";
import {
    registerUserSchema,
    loginUserSchema,
    RegisterUser,
    LoginUser,
} from "../schemas/user.schema";
import { hashPassword, comparePassword } from "../helper/hashPassword";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
} from "../helper/tokenHelper";

// Register new user
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password }: RegisterUser =
        registerUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
        where: {
            Email: email,
        },
    });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
        data: {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: hashedPassword,
        },
    });
    const sanitizedUser = { ...newUser, Password: undefined };

    res.status(201).json(
        new ApiResponse(201, sanitizedUser, "User registered successfully")
    );
});

// loginUser
const loginUser = asyncHandler(async (req, res) => {
    const { email, password }: LoginUser = loginUserSchema.parse(req.body);
    const user = await prisma.user.findUnique({
        where: {
            Email: email,
        },
    });

    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    const isPasswordMatch = await comparePassword(password, user.Password);
    if (!isPasswordMatch) {
        throw new ApiError(400, "Invalid email or password");
    }

    const accessToken = generateAccessToken(user.UserID);
    const refreshToken = generateRefreshToken(user.UserID);

    const hashedRefreshToken = await hashPassword(refreshToken);

    await prisma.user.update({
        where: {
            UserID: user.UserID,
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
    res.status(200).json(new ApiResponse(200, null, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        const payload: JwtPayload = verifyAccessToken(
            req.cookies.accessToken
        ) as JwtPayload;

        if (!payload.userId) {
            throw new ApiError(401, "Invalid access token");
        }

        const { userId } = payload;

        await prisma.user.update({
            where: {
                UserID: userId,
            },
            data: {
                RefreshToken: null,
            },
        });

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json(new ApiResponse(200, null, "Logout successful"));
    } catch (error: any) {
        console.error("Error logging out:", error);

        // Handle token verification errors
        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json(new ApiResponse(401, {}, "Access token has expired"));
        }

        if (error.name === "JsonWebTokenError") {
            return res
                .status(401)
                .json(new ApiResponse(401, {}, "Invalid access token"));
        }

        // For any other unexpected errors
        throw new ApiError(500, "Internal Server Error");
    }
});

export { registerUser, loginUser, logoutUser };
