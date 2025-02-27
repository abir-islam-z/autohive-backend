/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TUserRole = 'admin' | 'user';
export interface TUser {
  readonly _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TUserModel extends Model<TUser> {
  isUserExistsByEmail: (email: string) => Promise<TUser | null>;
  isPasswordMatched: (
    password: string,
    encryptedPassword: string,
  ) => Promise<boolean>;
}
