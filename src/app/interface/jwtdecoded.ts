export type DecodedJWTPayload = {
  userId: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
};
