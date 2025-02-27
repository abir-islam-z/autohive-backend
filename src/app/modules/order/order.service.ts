import mongoose from 'mongoose';
import { BadRequestException } from '../../errors/Exceptions';
import { CarModel } from '../car/car.model';
import { PaymentModel } from '../payment/payment.model';
import { UserModel } from '../user/user.model';
import { IOrder } from './order.interface';
import { OrderModel } from './order.model';
import { orderUtils } from './order.utils';
import { TOrder } from './order.validation';

const create = async (data: TOrder, userId: string, client_ip: string) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find user with session
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new BadRequestException('Invalid order request');
    }

    // Find car with session
    const findCar = await CarModel.findById(data.car).session(session);
    if (!findCar) {
      throw new BadRequestException('Invalid order request');
    }

    // Check availability
    const isAvailable = findCar.checkAvailability(data.quantity);
    if (!isAvailable) {
      throw new BadRequestException(
        'Car is not available in the requested quantity',
      );
    }

    const lastOrder = await OrderModel.getLastOrderID();
    const totalPrice = findCar.price * data.quantity;
    const orderId = orderUtils.generateOrderId(lastOrder ? lastOrder : '');

    // Create order using array syntax for transactions
    const order = await OrderModel.create(
      [
        {
          ...data,
          email: user.email,
          totalPrice,
          orderId,
          user: userId,
        },
      ],
      { session },
    );

    // Update stock within transaction
    await findCar.updateOne(
      { $inc: { quantity: -data.quantity } },
      { session },
    );

    // Payment processing happens outside the transaction since it's an external API call
    const shurjopayPayload = {
      amount: totalPrice.toString(),
      order_id: order[0].orderId,
      currency: 'BDT',
      customer_name: user.name,
      customer_address: 'Dhaka',
      customer_email: user.email,
      customer_phone: '01555004455',
      customer_city: 'Dhaka',
      client_ip,
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    // Record payment within transaction
    if (payment?.transactionStatus) {
      await PaymentModel.create(
        [
          {
            transactionStatus: payment.transactionStatus,
            id: payment.sp_order_id,
            order: order[0]._id,
          },
        ],
        { session },
      );
    }

    if (payment?.checkout_url) {
      // Commit the transaction if payment is successful
      await session.commitTransaction();
      return { url: payment.checkout_url, orderId: order[0].orderId };
    } else {
      // Abort transaction if payment fails
      await session.abortTransaction();
      throw new BadRequestException('Payment failed');
    }
  } catch (error) {
    // Abort transaction on any error
    await session.abortTransaction();
    throw error;
  } finally {
    // End session
    session.endSession();
  }
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await PaymentModel.findOneAndUpdate(
      {
        id: order_id,
      },
      {
        bank_status: verifiedPayment[0].bank_status,
        sp_code: verifiedPayment[0].sp_code,
        sp_message: verifiedPayment[0].sp_message,
        transactionStatus: verifiedPayment[0].transaction_status,
        method: verifiedPayment[0].method,
        date_time: verifiedPayment[0].date_time,
      },
    );
  }

  return verifiedPayment;
};

const findAll = async ({ user, role }: { user: string; role: string }) => {
  const orders =
    role === 'admin'
      ? await OrderModel.find()
          .populate('user', 'name email')
          .populate('car', 'name brand model')
      : await OrderModel.find({ user });

  return orders;
};

const findOne = async (
  id: string,
  user: {
    userId: string;
    role: string;
  },
) => {
  const query =
    user.role === 'admin' ? { _id: id } : { _id: id, user: user.userId };

  const order = await OrderModel.findOne(query)
    .populate('user', 'name email')
    .populate('car', 'name brand model')
    .select(user.role === 'admin' ? '' : '-isDeleted -updatedAt -createdAt');

  if (!order) {
    throw new BadRequestException('Order not found');
  }

  return order;
};

const update = async (id: string, data: Partial<IOrder>) => {
  return await OrderModel.findByIdAndUpdate(id, data, { new: true });
};

const remove = async (id: string) => {
  return await OrderModel.findByIdAndDelete(id);
};

export const OrderService = {
  create,
  findAll,
  verifyPayment,
  findOne,
  update,
  remove,
};
