// Pending, Processing, Shipped, Delivered
export const ORDER_STATUS = [
  'pending',
  'processing',
  'shipped',
  'delivered',
] as const;

export const OrderSearchableFields = ['orderId', 'email', 'shippingAddress'];
