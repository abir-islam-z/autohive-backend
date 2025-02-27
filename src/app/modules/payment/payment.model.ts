import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    id: {
      type: String,
      required: true,
      index: true,
    },
    transactionStatus: {
      type: String,
      required: true,
      index: true,
    },
    bank_status: {
      type: String,
    },
    sp_code: {
      type: String,
    },
    sp_message: {
      type: String,
    },
    method: {
      type: String,
    },
    date_time: {
      type: String,
    },
  },
  { timestamps: true },
);

// Create compound index for faster filtering by status and date
paymentSchema.index({ transactionStatus: 1, date_time: 1 });

export const PaymentModel = model<IPayment>('Payment', paymentSchema);
