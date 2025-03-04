import { z } from 'zod';
import { CAR_CATEGORY } from './car.const';

const createCarSchema = z.object({
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
  currency: z.string().default('USD'),
  color: z.string().trim().min(1, {
    message: 'Color is required',
  }),
  engine: z.string().trim().min(1, {
    message: 'Engine is required',
  }),
  transmission: z.string().trim().min(1, {
    message: 'Transmission is required',
  }),
  fuelType: z.string().trim().min(1, {
    message: 'Fuel type is required',
  }),
  mileage: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val >= 0, {
      message: 'Mileage must be non-negative',
    }),

  horsepower: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val >= 0, {
      message: 'Horsepower must be non-negative',
    }),

  driveType: z.string().trim().min(1, {
    message: 'Drive type is required',
  }),
});

export type TCreateCar = z.infer<typeof createCarSchema>;

const updateCarSchema = createCarSchema.strip().partial();

export const CarValidation = {
  createCarSchema,
  updateCarSchema,
};
