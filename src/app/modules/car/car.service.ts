import QueryBuilder from '../../builder/QueryBuilder';
import {
  BadRequestException,
  NotFoundException,
} from '../../errors/Exceptions';
import { CarModel } from './car.model';
import { TCreateCar } from './car.validation';

const create = async (data: TCreateCar, image: string | undefined) => {
  const { brand, model, year, category } = data;

  const existingCar = await CarModel.findOne({ brand, model, year, category });

  if (existingCar) {
    throw new BadRequestException(
      'A car with the same brand, model, year and category already exists',
    );
  }

  return await CarModel.create({ ...data, image });
};

const findAll = async ({ query }: { query: Record<string, unknown> }) => {
  const carsQuery = new QueryBuilder(CarModel.find(), query)
    .search(['brand', 'model', 'category'])
    .filter()
    .sort()
    .paginate();

  const minPrice = parseInt(query.minPrice as string, 10);
  const maxPrice = parseInt(query.maxPrice as string, 10);
  const availability = query.availability as string;
  const category = query.category as string;

  if (category) {
    carsQuery.modelQuery = carsQuery.modelQuery.find({ category });
  }

  if (minPrice && maxPrice) {
    carsQuery.modelQuery = carsQuery.modelQuery.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
  }

  if (availability) {
    carsQuery.modelQuery = carsQuery.modelQuery.find({
      inStock: availability === 'In Stock',
    });
  }

  const result = await carsQuery.modelQuery;
  const meta = await carsQuery.countTotal();

  return {
    meta,
    result,
  };
};

const findOne = async (id: string) => {
  const result = await CarModel.findById(id);

  if (!result) {
    throw new NotFoundException('Car not found');
  }

  return result;
};

const update = async (id: string, data: Partial<TCreateCar>) => {
  const result = await CarModel.findByIdAndUpdate(id, data, { new: true });

  if (!result) {
    throw new NotFoundException('Car not found');
  }

  return result;
};

const remove = async (id: string) => {
  const findCar = await CarModel.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!findCar) {
    throw new NotFoundException('Car not found');
  }

  findCar.isDeleted = true;

  await findCar.save();
};

export const CarService = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
