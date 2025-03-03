/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { BadRequestException } from '../../errors/Exceptions';
import { CarModel } from '../car/car.model';
import { UserModel } from '../user/user.model';
import { OrderSearchableFields } from './order.const';
import { OrderModel } from './order.model';
import { orderUtils } from './order.utils';
import { TOrder, TOrderUpdate } from './order.validation';

const getOrderQueryWithPopulation = (baseQuery: mongoose.Query<any, any>) => {
  return baseQuery.populate('user', 'name email');
};

const create = async (data: TOrder, userId: string, client_ip: string) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find user with session
    const user = await UserModel.findById(userId).session(session).lean();
    if (!user) {
      throw new BadRequestException('Invalid order request');
    }

    // Find car with session
    const findCar = await CarModel.findById(data.car).session(session).lean();
    if (!findCar) {
      throw new BadRequestException('Invalid order request');
    }

    // Check availability
    if (findCar.quantity < data.quantity) {
      throw new BadRequestException(
        'Car is not available in the requested quantity',
      );
    }

    const lastOrder = await OrderModel.getLastOrderID();
    const totalPrice = findCar.price * data.quantity;
    const orderId = orderUtils.generateOrderId(lastOrder ? lastOrder : '');

    // Create order using array syntax for transactions
    const newOrder = new OrderModel({
      ...data,
      totalPrice,
      orderId,
      user: userId,
    });

    // This will trigger the pre-save middleware
    const order = await newOrder.save({ session });

    // Payment processing happens outside the transaction since it's an external API call
    const shurjopayPayload = {
      amount: totalPrice.toString(),
      order_id: order.orderId,
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
      // Update order with payment reference
      await OrderModel.findByIdAndUpdate(
        order._id,
        {
          'payment.id': payment.sp_order_id,
          'payment.transactionStatus': payment.transactionStatus,
        },
        { session },
      );
    }

    if (payment?.checkout_url) {
      // Commit the transaction if payment is successful
      await session.commitTransaction();
      return { url: payment.checkout_url, orderId: order.orderId };
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
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

    if (verifiedPayment.length) {
      const paymentInfo = verifiedPayment[0];

      // Update payment information within transaction
      const order = await OrderModel.findOneAndUpdate(
        { 'payment.id': order_id },
        {
          'payment.bank_status': paymentInfo.bank_status,
          'payment.sp_code': paymentInfo.sp_code,
          'payment.sp_message': paymentInfo.sp_message,
          'payment.transactionStatus': paymentInfo.transaction_status,
          'payment.method': paymentInfo.method,
          'payment.date_time': paymentInfo.date_time,
        },
        { session, new: true }, // Add session parameter and return updated document
      );

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      // If payment successful, decrease car quantity
      if (paymentInfo.transaction_status === 'success') {
        // Decrease car quantity
        const car = await CarModel.findById(order.car).session(session);
        if (!car) {
          throw new BadRequestException('Car not found');
        }

        await CarModel.findByIdAndUpdate(
          order.car,
          { $inc: { quantity: -order.quantity } },
          { session },
        );
      }

      await session.commitTransaction();
      return verifiedPayment;
    }

    await session.commitTransaction();
    return verifiedPayment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const findAll = async ({ query }: { query: Record<string, unknown> }) => {
  const baseQuery = OrderModel.find();
  const populatedQuery = getOrderQueryWithPopulation(baseQuery);

  const ordersQuery = new QueryBuilder(populatedQuery, query)
    .search(OrderSearchableFields)
    .sort()
    .paginate();

  const [result, meta] = await Promise.all([
    ordersQuery.modelQuery.lean(), // Use lean() for better performance
    ordersQuery.countTotal(),
  ]);

  return { meta, result };
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
    .lean(); // Use lean() for better performance

  if (!order) {
    throw new BadRequestException('Order not found');
  }

  return order;
};

const update = async (id: string, data: TOrderUpdate) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find order with payment information
    const order = await OrderModel.findById(id).session(session);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Check payment status directly from embedded payment
    if (order.payment?.transactionStatus !== 'success') {
      throw new BadRequestException("Unpaid order's status can't be updated");
    }

    // Status validation logic
    if (
      order.currentStatus === 'processing' &&
      data.currentStatus === 'pending'
    ) {
      throw new BadRequestException('Order is already being processed');
    }

    if (
      order.currentStatus === 'shipped' &&
      (data.currentStatus === 'pending' || data.currentStatus === 'processing')
    ) {
      throw new BadRequestException('Order has already been shipped');
    }

    if (order.currentStatus === 'delivered') {
      throw new BadRequestException('Order has already been delivered');
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(id, data, {
      new: true,
      session,
    });

    await session.commitTransaction();
    return updatedOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const remove = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findById(id).session(session);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Check payment status directly from embedded payment
    if (order.payment?.transactionStatus === 'success') {
      throw new BadRequestException('Paid orders cannot be deleted');
    }

    const orderDate = order.createdAt.getTime();
    const currentDate = new Date().getTime();
    const thirtyMinutesInMs = 30 * 60 * 1000;

    if (currentDate - orderDate < thirtyMinutesInMs) {
      throw new BadRequestException(
        'Order cannot be deleted within 30 minutes of creation!',
      );
    }

    await OrderModel.findByIdAndDelete(id).session(session);
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const findUserOrders = async ({
  user,
  query,
}: {
  user: string;
  query: Record<string, unknown>;
}) => {
  const userOrdersQuery = new QueryBuilder(OrderModel.find({ user }), query)
    .paginate()
    .sort();

  const [result, meta] = await Promise.all([
    userOrdersQuery.modelQuery.lean(), // Use lean() for better performance
    userOrdersQuery.countTotal(),
  ]);

  return { meta, result };
};

export const OrderService = {
  create,
  findAll,
  verifyPayment,
  findOne,
  findUserOrders,
  update,
  remove,
};
