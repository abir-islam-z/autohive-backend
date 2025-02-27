import { TRegisterUser } from '../auth/auth.interface';
import { TUser } from './user.interface';
import { UserModel } from './user.model';

const createUser = async (data: TRegisterUser) => {
  return await UserModel.create(data);
};

const getAllUsers = async () => {
  return await UserModel.find();
};

const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

const updateUser = async (id: string, data: TUser) => {
  return await UserModel.findByIdAndUpdate(id, data, { new: true });
};

const deleteUser = async (id: string) => {
  return await UserModel.findByIdAndUpdate(id, { isActive: false });
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
