import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../config/db.config";

import { CartSchema, CartSchemaType } from "../schemas/cart.schema";

const viewCart = asyncHandler(async (req, res) => {
    const { UserID } = req.body;
    const cart = await prisma.cart.findUnique({
        where: {
            UserID,
        },
        include: {
            CartItems: {
                include: {
                    Product: true,
                },
            },
        },
    });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    return res.status(200).json(new ApiResponse(200, cart, "Cart found"));
});

const addItemToCart = asyncHandler(async (req, res) => {
    const { UserID, ProductID, quantity } = CartSchema.parse(req.body);

    // Check if cart exists for the user
    let cart = await prisma.cart.findUnique({
        where: {
            UserID,
        },
    });

    // If cart doesn't exist, create a new one
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                UserID,
            },
        });
    }

    // Add the new item to the cart
    const newItem = await prisma.cartItem.create({
        data: {
            CartID: cart.id,
            ProductID,
            quantity,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, newItem, "Item added to cart"));
});
