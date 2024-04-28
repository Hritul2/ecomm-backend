// Importing necessary modules from Express
import { Router } from "express";

// Importing controller functions
import {
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
    updateUserAddress,
    deleteUserAddress,
} from "../controllers/user.controller";

// Importing authentication middleware
import { authMiddleware } from "../middlewares/auth.middleware";

// Creating a new router instance
const router = Router();

// USER AUTHENTICATION ROUTES
router.route("/register").post(registerUser); // POST request to register a new user
router.route("/delete-profile").delete(authMiddleware, deleteUserProfile);
router.route("/login").post(loginUser); // POST request to log in a user
router.route("/logout").post(authMiddleware, logoutUser); // POST request to log out a user
router.route("/forgot-password").post(forgotPassword); // POST request to send a password reset email
router.route("/reset-password/:token").post(resetPassword);

// USER PROFILE ROUTES
router.route("/profile").get(authMiddleware, userProfile); // GET request to get user profile
router.route("/orders").get(authMiddleware, userOrders); // GET request to get user orders

// USER WISHLIST ROUTES
router.route("/wishlist").get(authMiddleware, getUserWishlist); // GET request to get user wishlist
router.route("/wishlist").post(authMiddleware, addToWishlist); //   POST request to add to user wishlist
router.route("/wishlist").delete(authMiddleware, deleteFromWishlist); // DELETE request to delete from user wishlist

// USER ADDRESS ROUTES
router.route("/address").get(authMiddleware, getUserAddresses); // GET request to get user addresses
router.route("/address").post(authMiddleware, addUserAddress); // POST request to add a new address
router.route("/address").put(authMiddleware, updateUserAddress); // PUT request to update an address
router.route("/address").delete(authMiddleware, deleteUserAddress); // DELETE request to delete an address

// Exporting the router for use in other files
export default router;
