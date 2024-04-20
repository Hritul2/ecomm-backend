import { Router } from "express";
import {
    registerAdmin,
    getAllAdmins,
    loginAdmin,
    logoutAdmin,
    getAllUsers,
} from "../controllers/admin.controller";
import { adminAuthMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.route("/register-admin").post(registerAdmin);
router.route("/login-admin").post(loginAdmin);
router.route("/logout-admin").post(adminAuthMiddleware, logoutAdmin);
router.route("/get-all-admins").get(adminAuthMiddleware, getAllAdmins);
router.route("/get-all-users").get(adminAuthMiddleware, getAllUsers);

export default router;
