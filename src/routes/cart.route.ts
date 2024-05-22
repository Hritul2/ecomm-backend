import { Router } from "express";
import { adminAuthMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.route('/cart').get(adminAuthMiddleware, g