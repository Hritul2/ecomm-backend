import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res
            .status(err.statusCode)
            .json(new ApiResponse(err.statusCode, {}, err.message));
    }
    console.error(err.stack); // log the error for debugging
    return res
        .status(500)
        .json(new ApiResponse(500, {}, "Internal Server Error"));
};

export { errorHandler };
