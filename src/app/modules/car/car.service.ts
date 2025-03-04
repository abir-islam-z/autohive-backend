import QueryBuilder from '../../builder/QueryBuilder';
import {
  BadRequestException,
  NotFoundException,
} from '../../errors/Exceptions';
import { CarModel } from './car.model';
import { TCreateCar } from './car.validation';

const create = async (data: TCreateCar, images: string[] | undefined) => {
  const { brand, model, year, category } = data;

  const existingCar = await CarModel.findOne({ brand, model, year, category });

  if (existingCar) {
    throw new BadRequestException(
      'A car with the same brand, model, year and category already exists',
    );
  }

  return await CarModel.create({ ...data, images });
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
  const brand = query.brand as string;
  const model = query.model as string;
  // GET /api/cars?category=Electric%2CLuxury&page=1&limit=12

  if (brand) {
    const brandsArray = brand.split(',');
    carsQuery.modelQuery = carsQuery.modelQuery.find({
      brand: { $in: brandsArray },
    });
  }

  if (model) {
    const modelsArray = model.split(',');
    carsQuery.modelQuery = carsQuery.modelQuery.find({
      model: { $in: modelsArray },
    });
  }

  if (category) {
    const categoryArray = category.split(',');
    carsQuery.modelQuery = carsQuery.modelQuery.find({
      category: { $in: categoryArray },
    });
  }

  if (minPrice && maxPrice) {
    carsQuery.modelQuery = carsQuery.modelQuery.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
  }

  if (availability) {
    carsQuery.modelQuery = carsQuery.modelQuery.find({
      inStock: availability === 'inStock',
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
const getBrandsAndModels = async () => {
  const results = await CarModel.aggregate([
    {
      $facet: {
        brands: [
          { $group: { _id: '$brand' } },
          { $project: { _id: 0, value: '$_id' } },
          { $match: { value: { $ne: null } } },
        ],
        models: [
          { $group: { _id: '$model' } },
          { $project: { _id: 0, value: '$_id' } },
          { $match: { value: { $ne: null } } },
        ],
      },
    },
  ]);

  // console.log(results[0].brands);
  // console.log(results[0].models);

  const brands = results[0].brands.map((item: { value: string }) => item.value);
  const models = results[0].models.map((item: { value: string }) => item.value);

  return {
    brands,
    models,
  };
};

export const CarService = {
  create,
  findAll,
  findOne,
  update,
  remove,
  getBrandsAndModels,
};
