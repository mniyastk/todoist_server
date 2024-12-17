import { Request, Response, NextFunction } from 'express';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../utils/customErrors';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation Error',
      errors: Object.values((err as any).errors || {}).map((val: any) => val.message),
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).name === 'MongoError' && (err as any).code === 11000) {
    res.status(409).json({
      message: 'Duplicate key error',
      error: 'Resource already exists',
    });
    return;
  }

  // JWT Errors
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      message: 'Session expired, please log in again',
    });
    return;
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      message: 'Invalid token, authentication failed',
    });
    return;
  }

  // Custom Errors
  if (err instanceof NotFoundError) {
    res.status(404).json({
      message: err.message,
    });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(403).json({
      message: err.message,
    });
    return;
  }

  if (err instanceof BadRequestError) {
    res.status(400).json({
      message: err.message,
    });
    return;
  }

  // Database connection error
  if ((err as any).name === 'MongoNetworkError') {
    res.status(503).json({
      message: 'Database connection error, please try again later',
    });
    return;
  }

  // Forbidden Access
  if (err.name === 'ForbiddenError') {
    res.status(403).json({
      message: 'You do not have permission to access this resource',
    });
    return;
  }

  // Generic server error
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
