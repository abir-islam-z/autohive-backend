import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CarService } from './car.service';

const create = catchAsync(async (req, res) => {
  const images =
    req?.files && Array.isArray(req.files)
      ? req.files.map(file => file.path)
      : [];
  const result = await CarService.create(req.body, images);
  sendResponse(res, {
    success: true,
    data: result,
    statusCode: 201,
    message: 'Car created successfully',
  });
});

const findAll = catchAsync(async (req, res) => {
  const data = await CarService.findAll({
    query: req.query,
  });

  sendResponse(res, {
    success: true,
    data: data.result,
    meta: data.meta,
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
  const images =
    req?.files && Array.isArray(req.files)
      ? req.files.map(file => file.path)
      : [];

  const data = { ...req.body, images };

  const result = await CarService.update(req.params.id, data);

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

const getBrandsAndModels = catchAsync(async (_req, res) => {
  const data = await CarService.getBrandsAndModels();

  sendResponse(res, {
    success: true,
    data,
    statusCode: 200,
    message: 'Brands retrieved successfully',
  });
});

export const CarController = {
  create,
  findAll,
  findOne,
  update,
  remove,
  getBrandsAndModels,
};
