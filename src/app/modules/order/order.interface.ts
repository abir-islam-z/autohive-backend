import { Model, Types } from 'mongoose';
import { CAR_CATEGORY } from '../car/car.const';
export type TOrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';
export interface IOrder {
  orderId: string;
  phone: string;
  email: string;
  car: Types.ObjectId;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  deliveryDate: Date;
  currentStatus: TOrderStatus;
  user: Types.ObjectId;
  payment: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
  isDeleted: boolean;
  processedAt: Date;
  shippedAt: Date;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  carSnapshot: {
    brand: string;
    model: string;
    year: number;
    price: number;
    category: keyof typeof CAR_CATEGORY;
    description: string;
    image: string;
    currency: string;
  };
}

export interface IOrderModel extends Model<IOrder> {
  getLastOrderID: () => Promise<string>;
  getTotalSales: () => Promise<number>;
}
