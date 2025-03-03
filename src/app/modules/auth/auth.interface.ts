export interface TLoginUser {
  email: string;
  password: string;
}

export interface TJwtPayload {
  jwtPayload: { userId: string; role: string; name: string; email: string };
  secret: string;
  expiresIn?: string | number;
}
