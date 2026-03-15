import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error.getStatus ? error.getStatus() : error.status || 500;
  res.status(statusCode).json({
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
};
