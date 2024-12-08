const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error(`error ${err.message}`);
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
      success: false,
    });
  });
};

export default asyncHandler;
