import QueryBuilder from '../../builder/QueryBuilder';
import { UserModel } from './user.model';
import { TUpdateUserStatus } from './user.validation';

const getAllUsers = async ({ query }: { query: Record<string, unknown> }) => {
  const usersQuery = new QueryBuilder(UserModel.find(), query)
    .search(['email', 'name'])
    .sort()
    .paginate();

  // filter by Role
  if (query.role) {
    usersQuery.modelQuery.find({ role: query.role });
  }

  // filter by isBlocked
  if (query.isBlocked) {
    usersQuery.modelQuery.find({
      isBlocked: query.isBlocked.toString() === 'true',
    });
  }

  const result = await usersQuery.modelQuery;
  const meta = await usersQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

const updateUser = async (id: string, data: TUpdateUserStatus) => {
  return await UserModel.findByIdAndUpdate(id, data, { new: true });
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
};
