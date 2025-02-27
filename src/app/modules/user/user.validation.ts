import { z } from 'zod';

export const userValidationSchema = z.object({
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

export const userUpdateValidationSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});
