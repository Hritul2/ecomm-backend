// auth.middleware.ts contains the authentication middleware that verifies access and refresh tokens.

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

/**
 * Authentication middleware to verify access and refresh tokens.
 * If the access token is valid, it attaches the user ID to the request object.
 * If the access token has expired, it attempts to refresh it using the refresh token.
 */

export const authMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        try {
            // Check if access token exists
            if (accessToken) {
                const payload: JwtPayload = verifyAccessToken(
                    accessToken
                ) as JwtPayload;
                const user = await prisma.user.findUnique({
                    where: { UserID: payload.userId },
                });
                if (!user) {
                    throw new ApiError(401, "User not found");
                }
                req.body = { ...req.body, userId: payload.userId };
                return next();
            }

            // If refresh token exists but access token is missing, attempt to refresh
            if (refreshToken) {
                const payload: JwtPayload = verifyRefreshToken(
                    refreshToken
                ) as JwtPayload;
                const user = await prisma.user.findUnique({
                    where: { UserID: payload.userId },
                });

                if (!user) {
                    throw new ApiError(401, "User not found");
                }

                if (
                    !(await compareHash(refreshToken, user.RefreshToken || ""))
                ) {
                    throw new ApiError(401, "Invalid refresh token");
                }

                const newAccessToken = generateAccessToken(payload.userId);
                const newRefreshToken = generateRefreshToken(payload.userId);
                const hashRefreshToken = await hashPassword(newRefreshToken);

                await prisma.user.update({
                    where: { UserID: payload.userId },
                    data: { RefreshToken: hashRefreshToken },
                });
                const cookieOptions = {
                    httpOnly: true,
                    //secure: true, // Enable in production
                    //sameSite: "strict",
                };
                res.cookie("accessToken", newAccessToken, cookieOptions);
                res.cookie("refreshToken", newRefreshToken, cookieOptions);

                req.body = { ...req.body, userId: payload.userId };
                return next();
            }

            throw new ApiError(401, "Access token or refresh token is missing");
        } catch (error: any) {
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
        }
    }
);
