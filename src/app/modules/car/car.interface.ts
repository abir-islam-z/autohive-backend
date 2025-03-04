/* eslint-disable no-unused-vars */
/* 


brand (string): The brand or manufacturer of the car (e.g., Toyota, BMW, Ford).
model (string): The model of the car (e.g., Camry, 3 Series, Focus).
year (number): The year of manufacture.
price (number): Price of the car.
category (string): The type of car (e.g., Sedan, SUV, Truck). use enum, exact value (Sedan, SUV, Truck, Coupe, Convertible)
description (string): A brief description of the car's features.
quantity (number): Quantity of the car available.
inStock (boolean): Indicates if the car is in stock.


*/
import { CAR_CATEGORY } from './car.const';

export type ICar = {
  brand: string;
  model: string;
  year: number;
  price: number;
  category: keyof typeof CAR_CATEGORY;
  description: string;
  quantity: number;
  inStock: boolean;
  images: string[];
  isDeleted: boolean;
  currency: string;
  color: string;
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: number;
  horsepower: number;
  driveType: string;

  // for methods
  checkAvailability: (quantity: number) => boolean;
};
