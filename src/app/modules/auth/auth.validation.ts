import { z } from 'zod';

const loginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerValidationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .superRefine((data, ctx) => {
      if (data?.toLocaleLowerCase().includes('password')) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must not contain the word "password" 🤬',
        });
      }
    }),
});

const changePasswordValidationSchema = z.object({
  oldPassword: z.string({
    required_error: 'Old password is required',
  }),
  newPassword: z.string({ required_error: 'Password is required' }),
});

const refreshTokenValidationSchema = z.object({
  refreshToken: z.string().nonempty({ message: 'Refresh token is required' }),
});

export const AuthValidation = {
  loginValidationSchema,
  registerValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
