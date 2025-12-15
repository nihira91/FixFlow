
class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 ERROR FROM TEAM MEMBER 1 MODULE:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { APIError, errorMiddleware };
