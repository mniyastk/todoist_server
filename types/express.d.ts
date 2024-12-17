// server/types/express.d.ts
import { TokenPayload } from '../utils/jwtHelper';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
