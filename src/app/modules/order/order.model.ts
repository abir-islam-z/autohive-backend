import { model, Schema } from 'mongoose';
import { CarModel } from '../car/car.model';
import { ORDER_STATUS } from './order.const';
import { IOrder, IOrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    carSnapshot: {
      type: {
        brand: String,
        model: String,
        year: Number,
        price: Number,
        category: String,
        description: String,
        image: String,
        currency: String,
        color: String,
        engine: String,
        transmission: String,
        fuelType: String,
        mileage: Number,
        horsepower: Number,
        driveType: String,
      },
    },
    unitPrice: {
      type: Number,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryDate: {
      type: Date,
    },
    currentStatus: {
      type: String,
      required: true,
      enum: ORDER_STATUS,
      default: 'pending',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    processedAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    payment: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  { timestamps: true },
);

orderSchema.pre('save', async function (next) {
  try {
    // Set delivery date if not provided
    if (!this.deliveryDate) {
      this.deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    // If this is a new order or car snapshot is not populated
    if ((this.isNew || !this.carSnapshot) && this.car) {
      // Need to import the Car model at the top of the file
      // Import nested model to avoid circular dependency
      const carData = await CarModel.findById(this.car);

      if (!carData) {
        return next(new Error('Car not found'));
      }

      // Check if car is in stock and has sufficient quantity
      if (!carData.inStock || carData.quantity < this.quantity) {
        return next(new Error('Requested car quantity not available'));
      }

      // Create a snapshot of the car at time of order
      this.carSnapshot = {
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        category: carData.category,
        description: carData.description,
        image: carData.image,
        currency: carData.currency,
        color: carData.color,
        engine: carData.engine,
        transmission: carData.transmission,
        fuelType: carData.fuelType,
        mileage: carData.mileage,
        horsepower: carData.horsepower,
        driveType: carData.driveType,
      };

      // Ensure price consistency
      this.unitPrice = carData.price;
      this.totalPrice = this.unitPrice * this.quantity;
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Add index for faster queries
orderSchema.index({ user: 1, email: 1 });
orderSchema.index({ currentStatus: 1 });

// Get last order Id

orderSchema.statics.getLastOrderID = async function () {
  const lastOrder = await this.findOne().sort({ createdAt: -1 });
  if (!lastOrder) return;

  return lastOrder.orderId;
};

// exclude deleted orders
orderSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

orderSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

orderSchema.pre('findOneAndUpdate', function () {
  this.where({ isDeleted: false });
});

// Add before the model export
orderSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as {
    processedAt: Date;
    shippedAt: Date;
    deliveredAt: Date;
    currentStatus?: string;
  };
  if (update && update.currentStatus) {
    // Set timestamp based on status
    if (update.currentStatus === 'processing') {
      update.processedAt = new Date();
    } else if (update.currentStatus === 'shipped') {
      update.shippedAt = new Date();
    } else if (update.currentStatus === 'delivered') {
      update.deliveredAt = new Date();
    }
  }
});

// exclude deleted orders from aggregate
orderSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: false } });
});

// exclude deleted orders from the count
orderSchema.pre('countDocuments', function () {
  this.where({ isDeleted: false });
});

// Get total sales
// Get total sales if payment is successful
orderSchema.statics.getTotalSales = async function () {
  const totalSales = await this.aggregate([
    {
      $match: {
        currentStatus: 'delivered',
        isDeleted: false,
        payment: { $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' },
      },
    },
  ]);

  return totalSales.length ? totalSales[0].total : 0;
};

// Pre-save middleware to populate car snapshot and set delivery date

export const OrderModel = model<IOrder, IOrderModel>('order', orderSchema);
