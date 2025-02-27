import { model, Schema } from 'mongoose';
import { ORDER_STATUS } from './order.const';
import { IOrder, IOrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryDate: {
      type: Date,
      required: true,
      // estimated delivery date should be 7 days from the order date
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    currentStatus: {
      type: String,
      required: true,
      enum: ORDER_STATUS,
      default: ORDER_STATUS[0],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Add index for faster queries
orderSchema.index({ user: 1, email: 1 });
orderSchema.index({ currentStatus: 1 });

// Get last order Id

orderSchema.statics.getLastOrderID = async function () {
  const lastOrder = await this.findOne().sort({ createdAt: -1 });
  if (!lastOrder) return;

  return lastOrder.orderId;
};

export const OrderModel = model<IOrder, IOrderModel>('order', orderSchema);
