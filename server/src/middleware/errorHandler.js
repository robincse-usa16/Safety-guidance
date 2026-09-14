export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.status ? error.message : 'Something went wrong. Please try again.',
  });
}
