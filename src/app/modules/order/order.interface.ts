import { Model, Types } from 'mongoose';

export interface IOrder {
  orderId: string;
  email: string;
  car: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  deliveryDate: Date;
  currentStatus: string;
  user: Types.ObjectId;
  payment: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderModel extends Model<IOrder> {
  getLastOrderID: () => Promise<string>;
}
