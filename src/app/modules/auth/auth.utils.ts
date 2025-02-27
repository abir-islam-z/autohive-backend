import jwt, { SignOptions } from 'jsonwebtoken';
import { TJwtPayload } from './auth.interface';

export const createToken = (payload: TJwtPayload) => {
  const signOptions: SignOptions = {
    expiresIn: payload.expiresIn as '1d',
  };

  return jwt.sign(payload.jwtPayload, payload.secret, signOptions);
};

