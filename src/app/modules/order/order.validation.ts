import { z } from 'zod';

export const orderValidationSchema = z.object({
  car: z.string({
    required_error: 'Car is required',
  }),
  quantity: z.number().min(1, {
    message: 'Quantity must be at least 1',
  }),
  shippingAddress: z.string({
    required_error: 'Shipping address is required',
  }),
});

export type TOrder = z.infer<typeof orderValidationSchema>;

export const orderUpdateValidationSchema = orderValidationSchema.partial();
