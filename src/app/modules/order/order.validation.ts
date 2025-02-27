import { z } from 'zod';

export const orderValidationSchema = z.object({
  car: z.string(),
  quantity: z.number(),
});

export type TOrder = z.infer<typeof orderValidationSchema>;

export const orderUpdateValidationSchema = orderValidationSchema.partial();
