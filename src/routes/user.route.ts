import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authMiddleware, logoutUser);

export default router;
