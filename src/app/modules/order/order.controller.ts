import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { OrderService } from './order.service';

const create = catchAsync(async (req, res) => {
  const result = await OrderService.create(
    req.body,
    req.user.userId,
    req?.ip as string,
  );
  sendResponse(res, {
    data: result,
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order has been placed successfully',
  });
});

const findAll = catchAsync(async (req, res) => {
  const result = await OrderService.findAll({
    query: req.query,
  });

  sendResponse(res, {
    meta: result.meta,
    data: result.result,
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully',
  });
});

const findOne = catchAsync(async (req, res) => {
  const result = await OrderService.findOne(req.params.id, req.user);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order retrieved successfully',
  });
});

const update = catchAsync(async (req, res) => {
  const result = await OrderService.update(req.params.id, req.body);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order updated successfully',
  });
});

const remove = catchAsync(async (req, res) => {
  const result = await OrderService.remove(req.params.id);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order removed successfully',
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order verified successfully',
    data: order,
  });
});

const findUserOrders = catchAsync(async (req, res) => {
  const data = await OrderService.findUserOrders({
    user: req.user.userId,
    query: req.query,
  });

  sendResponse(res, {
    data: data.result,
    meta: data.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: 'User orders retrieved successfully',
  });
});

export const OrderController = {
  create,
  findAll,
  findOne,
  findUserOrders,
  update,
  remove,
  verifyPayment,
};
