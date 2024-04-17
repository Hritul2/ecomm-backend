//app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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
import { errorHandler } from "./middlewares/errorHandler";

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export default app;
