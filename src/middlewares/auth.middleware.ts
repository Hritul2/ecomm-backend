import { ApiError } from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
    verifyAccessToken,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../helper/tokenHelper";
import { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { prisma } from "../config/db.config";
import { compareHash, hashPassword } from "../helper/hashPassword";

const cookieOptions = {
    httpOnly: true,
    //secure: true, // Enable in production
    //sameSite: "strict",
};

const handleTokenError = (error: any) => {
    console.error("Authentication error:", error.message);

    if (error instanceof TokenExpiredError) {
        throw new ApiError(401, "Access token has expired");
    }

    if (error instanceof JsonWebTokenError) {
        throw new ApiError(401, "Invalid token");
    }

    if (error instanceof ApiError) {
        throw error; // re-throw ApiError instances
    }

    console.error("Internal Server Error:", error);
    throw new ApiError(500, "Internal Server Error");
};

export const authMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        try {
            if (accessToken) {
                const payload: JwtPayload = verifyAccessToken(
                    accessToken
                ) as JwtPayload;
                const user = await prisma.user.findUnique({
                    where: { UserID: payload.userID },
                });

                if (!user) {
                    throw new ApiError(401, "User not found");
                }

                req.body = { ...req.body, userID: payload.userID };
                return next();
            }

            if (refreshToken) {
                const payload: JwtPayload = verifyRefreshToken(
                    refreshToken
                ) as JwtPayload;
                const user = await prisma.user.findUnique({
                    where: { UserID: payload.userID },
                });

                if (
                    !user ||
                    !(await compareHash(refreshToken, user.RefreshToken || ""))
                ) {
                    throw new ApiError(401, "Invalid refresh token");
                }

                const newAccessToken = generateAccessToken(payload.userID);
                const newRefreshToken = generateRefreshToken(payload.userID);
                const hashRefreshToken = await hashPassword(newRefreshToken);

                await prisma.user.update({
                    where: { UserID: payload.userID },
                    data: { RefreshToken: hashRefreshToken },
                });

                res.cookie("accessToken", newAccessToken, cookieOptions);
                res.cookie("refreshToken", newRefreshToken, cookieOptions);

                req.body = { ...req.body, userID: payload.userID };
                return next();
            }

            throw new ApiError(401, "Access token or refresh token is missing");
        } catch (error: any) {
            handleTokenError(error);
        }
    }
);

export const adminAuthMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        try {
            if (accessToken) {
                const payload: JwtPayload = verifyAccessToken(
                    accessToken
                ) as JwtPayload;
                const admin = await prisma.admin.findUnique({
                    where: { AdminID: payload.userID },
                });

                if (!admin) {
                    throw new ApiError(401, "Admin not found");
                }

                req.body = { ...req.body, adminID: payload.userID };
                return next();
            }

            if (refreshToken) {
                const payload: JwtPayload = verifyRefreshToken(
                    refreshToken
                ) as JwtPayload;
                const admin = await prisma.admin.findUnique({
                    where: { AdminID: payload.userID },
                });

                if (
                    !admin ||
                    !(await compareHash(refreshToken, admin.RefreshToken || ""))
                ) {
                    throw new ApiError(401, "Invalid refresh token");
                }

                const newAccessToken = generateAccessToken(payload.userID);
                const newRefreshToken = generateRefreshToken(payload.userID);
                const hashRefreshToken = await hashPassword(newRefreshToken);

                await prisma.admin.update({
                    where: { AdminID: payload.userID },
                    data: { RefreshToken: hashRefreshToken },
                });

                res.cookie("accessToken", newAccessToken, cookieOptions);
                res.cookie("refreshToken", newRefreshToken, cookieOptions);

                req.body = { ...req.body, adminID: payload.userID };
                return next();
            }

            throw new ApiError(401, "Access token or refresh token is missing");
        } catch (error: any) {
            handleTokenError(error);
        }
    }
);
