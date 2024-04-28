import { Router } from "express";
const router = Router();

import {
    getAllProducts,
    getProductById,
} from "../controllers/product.controller";

// ADDRESS ROUTES
router.route("").get(getAllProducts);
router.route("/:id").get(getProductById);

export default router;
