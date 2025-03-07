import { model, Schema } from 'mongoose';
import { CAR_CATEGORY } from './car.const';
import { ICar } from './car.interface';

const carSchema = new Schema<ICar>(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be at least 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CAR_CATEGORY,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: false,
    },
    images: {
      type: [String],
      required: [true, 'Image URL is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
    },

    engine: {
      type: String,
      required: [true, 'Engine is required'],
    },

    transmission: {
      type: String,
      required: [true, 'Transmission is required'],
    },

    fuelType: {
      type: String,
      required: [true, 'Fuel Type is required'],
    },

    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
    },

    horsepower: {
      type: Number,
      required: [true, 'Horsepower is required'],
    },

    driveType: {
      type: String,
      required: [true, 'Drive Type is required'],
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for improved query performance
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ category: 1 });

// Pre-save middleware to ensure inStock is set based on quantity
carSchema.pre('save', function (next) {
  this.inStock = this.quantity > 0;
  next();
});

carSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update && 'quantity' in update) {
    update.inStock = update.quantity > 0;
  }
  next();
});

// Quantity check while creating a new order
carSchema.methods.checkAvailability = function (quantity: number): boolean {
  return this.quantity >= quantity;
};

carSchema.pre('find', function () {
  // don't include deleted cars
  this.where({ isDeleted: false });
});

carSchema.pre('findOne', function () {
  // don't include deleted cars
  this.where({ isDeleted: false });
});

carSchema.pre('findOneAndUpdate', function () {
  // don't include deleted cars
  this.where({ isDeleted: false });
});

// aggregate middleware to exclude deleted cars
carSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: false } });
});

carSchema.pre('countDocuments', function () {
  // don't include deleted cars
  this.where({ isDeleted: false });
});

export const CarModel = model<ICar>('Car', carSchema);
