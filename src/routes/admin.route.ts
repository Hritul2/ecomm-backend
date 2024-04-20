import { Router } from "express";
import {
    registerAdmin,
    getAllAdmins,
    loginAdmin,
    logoutAdmin,
} from "../controllers/admin.controller";
import { adminAuthMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.route("/register-admin").post(registerAdmin);
router.route("/login-admin").post(loginAdmin);
router.route("/logout-admin").post(adminAuthMiddleware, logoutAdmin);
router.route("/get-all-admins").get(adminAuthMiddleware, getAllAdmins);

export default router;
