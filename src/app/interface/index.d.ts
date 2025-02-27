import { DecodedJWTPayload } from './jwtdecoded';

declare global {
  namespace Express {
    interface Request {
      user: DecodedJWTPayload;
    }
  }
}
