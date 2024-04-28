//app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.static("public"));

import userRouter from "./routes/user.route";
import adminRouter from "./routes/admin.route";
import productRouter from "./routes/product.route";

app.get("/", (req: Request, res: Response) => {
    return res.send("Hello World");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/products", productRouter);

app.use(errorHandler);

export default app;
