// src/utils/customErrors.ts

export class BadRequestError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.statusCode = 400;
      this.name = 'BadRequestError';
      Error.captureStackTrace(this, BadRequestError);
    }
  }
  
  export class UnauthorizedError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.statusCode = 401;
      this.name = 'UnauthorizedError';
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
  
  export class ConflictError extends Error {
    statusCode: number;
    field?: string;
    constructor(message: string, field?: string) {
      super(message);
      this.statusCode = 409;
      this.name = 'ConflictError';
      this.field = field;
      Error.captureStackTrace(this, ConflictError);
    }
  }
  
  export class NotFoundError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.statusCode = 404;
      this.name = 'NotFoundError';
      Error.captureStackTrace(this, NotFoundError);
    }
  }
  