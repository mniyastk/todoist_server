import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { environmentConfig } from '../config/environment';

export interface CustomRequest extends Request {
  user?: TokenPayload;
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, environmentConfig.jwtSecret, {
    expiresIn: '1h',
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, environmentConfig.jwtSecret, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, environmentConfig.jwtSecret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  try {
    const decoded = verifyToken(token);
    req.user  = decoded;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
}