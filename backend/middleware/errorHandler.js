const errorHandler = (err, req, res, next) => {
  console.error("Détails de l'erreur:", {
    message: err.message,
    body: req.body,
    headers: req.headers,
    stack: err.stack,
  });

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    error: process.env.NODE_ENV !== "production" ? err.stack : null,
  });
};

export default errorHandler;
