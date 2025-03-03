import { z } from 'zod';

const createOrder = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({
      message: 'Invalid email',
    }),
  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .regex(/^\+?(88)?01[0-9]\d{8}$/, {
      message: 'Invalid phone number',
    }),
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

export type TOrder = z.infer<typeof createOrder>;

const updateOrder = z.object({
  currentStatus: z.enum(['pending', 'processing', 'shipped', 'delivered'], {
    message: 'Invalid status',
  }),
  deliveryDate: z.string().datetime({
    message: 'Invalid date',
  }),
});

export type TOrderUpdate = z.infer<typeof updateOrder>;

export const OrderValidation = {
  createOrder,
  updateOrder,
};
