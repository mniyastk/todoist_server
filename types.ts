// src/types/express/index.d.ts
import { TokenPayload } from './utils/jwtHelper'; // Adjust the import path as needed

// Declare a module to extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// If you're using a separate file, you might need to export something to make it a module
export {};