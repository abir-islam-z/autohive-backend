import { z } from 'zod';
import { CAR_CATEGORY } from './car.const';

export const carValidationSchema = z.object({
  brand: z.string({ required_error: 'Brand is required' }),
  model: z.string({ required_error: 'Model is required' }),
  year: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val >= 1900 && val <= 2025, {
      message: 'Year must be between 1900 and 2025',
    }),
  price: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val >= 0, {
      message: 'Price must be non-negative',
    }),
  category: z.enum(CAR_CATEGORY),
  description: z.string({
    required_error: 'Description is required',
  }),
  quantity: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val >= 0 && Number.isInteger(val), {
      message: 'Quantity must be a non-negative integer',
    }),
});

export type ICar = z.infer<typeof carValidationSchema>;

export const carUpdateValidationSchema = carValidationSchema.partial();
