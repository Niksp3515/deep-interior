export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error("SERVER ERROR:", err);
  }
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : err.message,
    field: err.field,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
