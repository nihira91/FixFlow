const errorHandler = (err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  return res.status(500).json({
    message: "Internal Server Error",
    error: err.message
  });
};

module.exports = errorHandler;
