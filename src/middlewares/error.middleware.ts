import type { Request, Response, NextFunction } from "express";

/**
 * Custom Application Error
 * Extends Error with HTTP status code and operational flag
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error Response Interface
 */
interface ErrorResponse {
  success: false;
  status: string;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
  stack?: string;
}

/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default error values
  let statusCode = 500;
  let message = "Internal server error";
  let status = "error";
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // If it's our custom AppError, use its values
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    status = err.status;
  }

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    status,
    message,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === "development" && !isOperational) {
    errorResponse.stack = err.stack;
  }

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorResponse.message = "Validation error";
  }

  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    statusCode = 409;
    errorResponse.message = "Duplicate entry found";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorResponse.message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorResponse.message = "Token has expired";
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * Not Found Handler Middleware
 * Handles 404 errors for undefined routes
 */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

/**
 * Async Handler Wrapper
 * Wraps async functions to catch errors and pass to error middleware
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
