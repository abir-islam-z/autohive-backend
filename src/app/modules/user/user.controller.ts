import catchAsync from '../../utils/catchAsync';
import { UserService } from './user.service';

const create = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);
  res.status(201).json({ data: user });
});

const findAll = catchAsync(async (_req, res) => {
  const users = await UserService.getAllUsers();
  res.status(200).json({ data: users });
});

const findOne = catchAsync(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  res.status(200).json({ data: user });
});

const update = catchAsync(async (req, res) => {
  const user = await UserService.updateUser(req.params.id, req.body);
  res.status(200).json({ data: user });
});

const remove = catchAsync(async (req, res) => {
  await UserService.deleteUser(req.params.id);
  res.status(204).json({ data: null });
});

export const UserController = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
