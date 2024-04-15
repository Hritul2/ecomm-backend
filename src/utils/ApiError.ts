class ApiError extends Error {
    statusCode: number;
    message: string;
    errors: any[];

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors = [],
        statck = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;

        if (statck) {
            this.stack = statck;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
