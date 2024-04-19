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
} from "../controllers/user.controller";

// Importing authentication middleware
import { authMiddleware } from "../middlewares/auth.middleware";

// Creating a new router instance
const router = Router();

// Route for user registration
router.route("/register").post(registerUser); // POST request to register a new user

// Route for user login
router.route("/login").post(loginUser); // POST request to log in a user

// Route for user logout, requires authentication middleware
router.route("/logout").post(authMiddleware, logoutUser); // POST request to log out a user

// Route for forgot password
router.route("/forgot-password").post(forgotPassword); // POST request to send a password reset email

// Route to reset password
router.route("/reset-password/:token").post(resetPassword); // POST request to reset a user's password

// route to get user profile
router.route("/profile").get(authMiddleware, userProfile);

// Exporting the router for use in other files
export default router;
