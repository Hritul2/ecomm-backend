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
import { AddressSchemaType, addressSchema } from "../schemas/address.schema";
import { hashPassword, compareHash } from "../helper/hashPassword";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../helper/tokenHelper";

// USER AUTHENTICATION CONTROLLERS
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
        userID: user.UserID,
        email: user.Email,
    });
    const refreshToken = generateRefreshToken({ userID: user.UserID });
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
const logoutUser = asyncHandler(async (req, res) => {
    try {
        const { userID } = req.body;
        if (!userID) {
            throw new ApiError(400, "User ID is required");
        }

        await prisma.user.update({
            where: {
                UserID: userID,
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
// TODO: use express-rate-limit to limit the number of requests to this endpoint
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
const deleteUserProfile = asyncHandler(async (req, res) => {
    const userID = req.body.userID;
    if (!userID) {
        throw new ApiError(400, "User ID is required");
    }
    const user = await prisma.user.delete({
        where: {
            UserID: userID,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User profile deleted"));
});

// USER PROFILE CONTROLLERS
const userProfile = asyncHandler(async (req, res) => {
    const userID = req.body.userID;
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
const userOrders = asyncHandler(async (req, res) => {
    const userID = req.body.userID;
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

// USER WISHLIST CONTROLLERS
const addToWishlist = asyncHandler(async (req, res) => {
    const { userID, productID } = req.body;
    // validation
    if (!userID) {
        throw new ApiError(400, "User ID is required");
    }
    if (!productID) {
        throw new ApiError(400, "Product ID is required");
    }
    // check if product exists
    const product = await prisma.product.findUnique({
        where: {
            ProductID: productID,
        },
    });
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    // check if user wishlist already exists if not create one
    let userWishlist = await prisma.wishlist.findUnique({
        where: {
            UserID: userID,
        },
    });
    if (!userWishlist) {
        userWishlist = await prisma.wishlist.create({
            data: {
                UserID: userID,
            },
        });
    }
    // Add the product to the wishlist if it's not already added
    const productInWishlist = await prisma.wishlist.findFirst({
        where: {
            UserID: userID,
            Products: {
                some: {
                    ProductID: productID,
                },
            },
        },
    });
    if (productInWishlist) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Product already in wishlist"));
    }
    const updatedWishlist = await prisma.wishlist.update({
        where: {
            WishlistID: userWishlist.WishlistID,
        },
        data: {
            Products: {
                connect: {
                    ProductID: productID,
                },
            },
        },
    });
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedWishlist, "Product added to wishlist")
        );
});
const getUserWishlist = asyncHandler(async (req, res) => {
    const userID = req.body.userID;
    if (!userID) {
        throw new ApiError(400, "User ID is required");
    }
    const userWishlist = await prisma.wishlist.findMany({
        where: {
            UserID: userID,
        },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, userWishlist, "User wishlist"));
});
const deleteFromWishlist = asyncHandler(async (req, res) => {
    const { userID, productID } = req.body;
    // validation
    if (!userID) {
        throw new ApiError(400, "User ID is required");
    }
    if (!productID) {
        throw new ApiError(400, "Product ID is required");
    }
    // check if product exists
    const product = await prisma.product.findUnique({
        where: {
            ProductID: productID,
        },
    });
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    // check if user wishlist already exists if not return
    const userWishlist = await prisma.wishlist.findUnique({
        where: {
            UserID: userID,
        },
    });
    if (!userWishlist) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Product not in wishlist"));
    }
    // check if product is in wishlist
    const productInWishlist = await prisma.wishlist.findFirst({
        where: {
            UserID: userID,
            Products: {
                some: {
                    ProductID: productID,
                },
            },
        },
    });
    if (!productInWishlist) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Product not in wishlist"));
    }
    // remove product from wishlist
    const updatedWishlist = await prisma.wishlist.update({
        where: {
            WishlistID: userWishlist.WishlistID,
        },
        data: {
            Products: {
                disconnect: {
                    ProductID: productID,
                },
            },
        },
    });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedWishlist,
                "Product removed from wishlist"
            )
        );
});

// USER ADDRESS CONTROLLERS
const getUserAddresses = asyncHandler(async (req, res) => {
    console.log("get user addresses");
    const { userID } = req.body;
    if (!userID) {
        throw new ApiError(400, "User ID is required");
    }
    const userAddresses = await prisma.address.findMany({
        where: {
            UserID: userID,
        },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, userAddresses, "User addresses"));
});

const addUserAddress = asyncHandler(async (req, res) => {
    const { userID, address }: { userID: string; address: AddressSchemaType } =
        req.body;
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

    const {
        firstLine,
        secondLine,
        street,
        city,
        state,
        country,
        pinconde,
        addressFor,
        deliveryPhone,
    }: AddressSchemaType = addressSchema.parse(address);

    const newAddress = await prisma.address.create({
        data: {
            FirstLine: firstLine,
            SecondLine: secondLine,
            Street: street,
            City: city,
            State: state,
            Country: country,
            Pincode: pinconde,
            AddressFor: addressFor,
            DelliveryPhone: deliveryPhone,
            UserID: userID,
        },
    });
    return res
        .status(201)
        .json(new ApiResponse(201, newAddress, "Address added"));
});
export {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    userProfile,
    userOrders,
    getUserWishlist,
    addToWishlist,
    deleteFromWishlist,
    deleteUserProfile,
    getUserAddresses,
    addUserAddress,
};
