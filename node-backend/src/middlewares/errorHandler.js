const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error stack for debugging

  // Check if the error has a status code, otherwise set to 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message,
    },
  });
};

module.exports = errorHandler;
