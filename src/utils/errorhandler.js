class APIError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err);

    const status = err.statusCode || 500;
    const message = err.message || "Internal server error";

    return res.status(status).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development" ? err.stack : undefined

    });
};

module.exports = {
    APIError,
    errorMiddleware
};