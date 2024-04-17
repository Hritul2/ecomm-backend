import jwt from "jsonwebtoken";
import { prisma } from "../config/db.config";
import { compareHash } from "./hashPassword";

const generateAccessToken = async (userId: string) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "1d",
    });
};

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
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
