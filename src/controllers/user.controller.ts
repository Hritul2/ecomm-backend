// user.controller.ts contains the user controller functions for registering and logging in users.
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { sendEmail } from "../utils/emailSender";
import { prisma } from "../config/db.config";
import {
    registerUserSchema,
    loginUserSchema,
    forgotPasswordSchema,
    RegisterUser,
    LoginUser,
    ForgotPassword,
} from "../schemas/user.schema";
import { hashPassword, compareHash } from "../helper/hashPassword";
import {
    generateAccessToken,
    generateRefreshToken,
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
    const sanitizedUser = {
        ...newUser,
        Password: undefined,
        UserID: undefined,
    };

    return res
        .status(201)
        .json(
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
        // console.log("Invalid email or password");
        throw new ApiError(400, "Invalid email or password", [], "");
    }

    const isPasswordMatch = await compareHash(password, user.Password);
    if (!isPasswordMatch) {
        throw new ApiError(400, "Invalid email or password");
    }

    const accessToken = generateAccessToken({
        userId: user.UserID,
        email: user.Email,
    });
    const refreshToken = generateRefreshToken({ userId: user.UserID });
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

    return res.status(200).json(new ApiResponse(200, null, "Login successful"));
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }

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
        throw new ApiError(500, "Internal Server Error");
    }
});

// forgotPassword
const forgotPassword = asyncHandler(async (req, res) => {
    // fetch data from request body

    const { email }: ForgotPassword = forgotPasswordSchema.parse(req.body);
    // search if user exists
    const user = await prisma.user.findUnique({
        where: {
            Email: email,
        },
    });
    // if user does not exist
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    // generate a token

    const passwordResetToken = await prisma.passwordReset.create({
        data: {
            UserID: user.UserID,
            Expiry: new Date(Date.now() + 3600000),
        },
    });

    const token = passwordResetToken.Token;
    // const resetLink = `http://localhost:8001/api/users/reset-password/${token}`;
    const resetLink = `${req.protocol}://${req.get("host")}/api/users/reset-password/${token}`;
    const emailText = `You requested to reset your password. Click the link below to reset it:\n${resetLink}`;
    // send email to user

    console.log(`use sendEmail function to send email when in production`);
    //await sendEmail(email, "Reset Password", emailText);
    console.log(emailText);

    // return success response
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Password reset email sent"));
});

// resetPassword
const resetPassword = asyncHandler(async (req, res) => {
    console.log("reset password");
    const { token } = req.params;
    console.log(token);
    const { password } = req.body;

    const resetToken = await prisma.passwordReset.findUnique({
        where: {
            Token: token,
        },
    });

    if (!resetToken || resetToken.Expiry < new Date()) {
        throw new ApiError(400, "Invalid or expired token");
    }
    const user = await prisma.user.update({
        where: {
            UserID: resetToken.UserID,
        },
        data: {
            Password: await hashPassword(password),
        },
    });
    await prisma.passwordReset.delete({
        where: { PasswordResetID: resetToken.PasswordResetID },
    });
    return res.status(200).json(new ApiResponse(200, null, "Password reset"));
});

// delete user profile
const deleteUserProfile = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    const user = await prisma.user.delete({
        where: {
            UserID: userId,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User profile deleted"));
});

// user Profile
const userProfile = asyncHandler(async (req, res) => {
    const userID = req.body.userId;
    if (!userID) {
        throw new ApiError(400, "User ID is required");
    }
    const user = await prisma.user.findUnique({
        where: {
            UserID: userID,
        },
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const userOrders = await prisma.order.findMany({
        where: {
            UserID: userID,
        },
    });
    console.log(`userOrders: ${userOrders}`);
    const userWislist = await prisma.wishlist.findMany({
        where: {
            UserID: userID,
        },
    });
    console.log(`userWishlist: ${userWislist}`);
    const userAddresses = await prisma.address.findMany({});
    console.log(`userAddresses: ${userAddresses}`);

    const sanitizedUser = {
        ...user,
        ...userOrders,
        ...userWislist,
        ...userAddresses,
        UserID: undefined,
        Password: undefined,
        RefreshToken: undefined,
    };
    return res
        .status(200)
        .json(new ApiResponse(200, sanitizedUser, "User profile"));
});

// user orders
const userOrders = asyncHandler(async (req, res) => {
    const userID = req.body.userId;
    if (!userID) {
        throw new ApiError(400, "User ID is required");
    }
    const userOrders = await prisma.order.findMany({
        where: {
            UserID: userID,
        },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, userOrders, "User orders"));
});

// user put item to wishlist

// get user wishlist
const getUserWishlist = asyncHandler(async (req, res) => {
    const userID = req.body.userId;
    if (!userID) {
        throw new ApiError(400, "User ID is required");
    }
    const user = await prisma.user.findUnique({
        where: { UserID: userID },
        include: {
            Wishlist: {
                include: {
                    WishlistProduct: true,
                },
            },
        },
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user.Wishlist, "User wishlist"));
});
// delete item from user wishList

export {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    userProfile,
    userOrders,
    getUserWishlist,
    deleteUserProfile,
};
