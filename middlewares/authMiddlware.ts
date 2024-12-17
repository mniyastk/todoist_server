import { Request, Response, NextFunction } from 'express'; 
import { verifyToken } from '../utils/jwtHelper';

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(new Error('No token provided'));
    }

    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    next(new Error('Invalid or expired token'));
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      (req as any).user = decoded;
    } catch (error) {
      // If token is invalid, continue without setting user
    }
  }

  next();
}