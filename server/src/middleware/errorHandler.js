/**
 * Global error-handling middleware.
 * Must have 4 params so Express recognizes it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`❌ [${status}] ${message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(status).json({
    error: message,
    status,
  });
}
