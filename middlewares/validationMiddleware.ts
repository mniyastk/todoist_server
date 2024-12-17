// src/middlewares/validationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { validateInput, userRegistrationSchema, taskCreationSchema } from '../utils/validation';

export function validateUserRegistration(req: Request, res: Response, next: NextFunction) {
  try {
    validateInput(req.body, userRegistrationSchema);
    next();
  } catch (error) {
    res.status(400).json({ 
      message: 'Validation Error', 
      error: error instanceof Error ? error.message : 'Invalid input' 
    });
  }
}

export function validateTaskCreation(req: Request, res: Response, next: NextFunction) {
  try {
    validateInput(req.body, taskCreationSchema);
    next();
  } catch (error) {
    res.status(400).json({ 
      message: 'Task Validation Error', 
      error: error instanceof Error ? error.message : 'Invalid task data' 
    });
  }
}