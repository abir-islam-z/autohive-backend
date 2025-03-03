import { z } from 'zod';
import { USER_ROLES } from './user.constant';

const userUpdate = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

const updateUserStatus = z.object({
  isBlocked: z.boolean().optional(),
  role: z.enum(USER_ROLES).optional(),
});

export type TUserUpdate = z.infer<typeof userUpdate>;
export type TUpdateUserStatus = z.infer<typeof updateUserStatus>;

export const UserValidation = {
  userUpdate,
  updateUserStatus,
};
