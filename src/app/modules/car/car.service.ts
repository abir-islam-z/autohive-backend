import {
  BadRequestException,
  NotFoundException,
} from '../../errors/Exceptions';
import { CarModel } from './car.model';
import { ICar } from './car.validation';

const create = async (data: ICar, image: string | undefined) => {
  const { brand, model, year, category } = data;

  const existingCar = await CarModel.findOne({ brand, model, year, category });

  if (existingCar) {
    throw new BadRequestException(
      'A car with the same brand, model, year and category already exists',
    );
  }

  return await CarModel.create({ ...data, image });
};

const findAll = async () => {
  return await CarModel.find();
};

const findOne = async (id: string) => {
  const result = await CarModel.findById(id);

  if (!result) {
    throw new NotFoundException('Car not found');
  }

  return result;
};

const update = async (id: string, data: Partial<ICar>) => {
  const result = await CarModel.findByIdAndUpdate(id, data, { new: true });

  if (!result) {
    throw new NotFoundException('Car not found');
  }

  return result;
};

const remove = async (id: string) => {
  const result = await CarModel.findByIdAndDelete(id);

  if (!result) {
    throw new NotFoundException('Car not found');
  }
};

export const CarService = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
