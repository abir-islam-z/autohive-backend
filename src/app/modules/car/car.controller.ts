import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CarService } from './car.service';

const create = catchAsync(async (req, res) => {
  const result = await CarService.create(req.body, req.file?.path);
  sendResponse(res, {
    success: true,
    data: result,
    statusCode: 201,
    message: 'Car created successfully',
  });
});

const findAll = catchAsync(async (_req, res) => {
  const result = await CarService.findAll();

  sendResponse(res, {
    success: true,
    data: result,
    statusCode: 200,
    message: 'Cars retrieved successfully',
  });
});

const findOne = catchAsync(async (req, res) => {
  const result = await CarService.findOne(req.params.id);

  sendResponse(res, {
    success: true,
    data: result,
    statusCode: 200,
    message: 'Car retrieved successfully',
  });
});

const update = catchAsync(async (req, res) => {
  const result = await CarService.update(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    data: result,
    statusCode: 200,
    message: 'Car updated successfully',
  });
});

const remove = catchAsync(async (req, res) => {
  await CarService.remove(req.params.id);

  sendResponse(res, {
    success: true,
    data: {},
    statusCode: 200,
    message: 'Car deleted successfully',
  });
});

export const CarController = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
