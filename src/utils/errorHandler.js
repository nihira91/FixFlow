// src/utils/errorHandler.js

class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global Error Middleware
const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

module.exports = {
  APIError,
  errorMiddleware
};
