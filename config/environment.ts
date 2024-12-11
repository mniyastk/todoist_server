import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ 
  path: path.resolve(process.cwd(), 
    process.env.NODE_ENV === 'production' 
      ? '.env.production' 
      : '.env.development'
  ) 
});

export interface EnvironmentConfig {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  nodeEnv: string;
}

export function createEnvironmentConfig(): EnvironmentConfig {
  const validateJwtSecret = (secret?: string): string => {
    if (!secret || secret.length < 32) {
      console.warn('JWT Secret is too short or missing. Generating a random secret.');
      return crypto.randomBytes(64).toString('hex');
    }
    return secret;
  };

  return {
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/todoist_clone',
    jwtSecret: validateJwtSecret(process.env.JWT_SECRET),
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}

export function isProduction(config: EnvironmentConfig): boolean {
  return config.nodeEnv === 'production';
}

export function isDevelopment(config: EnvironmentConfig): boolean {
  return config.nodeEnv === 'development';
}

// Singleton-like pattern for environment config
export const environmentConfig = createEnvironmentConfig();