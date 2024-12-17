// src/middlewares/loggingMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info({
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    ip: req.ip
  });
  next();
}

export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path
  });
  next(err);
}