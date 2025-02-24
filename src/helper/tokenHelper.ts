// tokenHelper.ts is a helper file that contains functions to generate and verify access and refresh tokens. This file is used in the auth.middleware.ts file to generate and verify tokens for authentication.
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateRefreshToken = (obj: { userID: string }) => {
    return jwt.sign({ ...obj }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "15d",
    });
};
const generateAccessToken = (obj: { userID: string; email: string }) => {
    return jwt.sign({ ...obj }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15d",
    });
};

const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

const verifyRefreshToken = async (token: string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
