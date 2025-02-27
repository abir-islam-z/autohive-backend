import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUser): Promise<string> => {
  const user = await UserModel.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const isBlocked = user.isBlocked;

  if (isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  const isPasswordMatched = await UserModel.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Credentials');
  }

  const jwtPayload = {
    userId: user._id as unknown as string,
    role: user.role as string,
    name: user.name as string,
    email: user.email as string,
  };

  const accessToken = createToken({
    jwtPayload,
    secret: config.JWT_ACCESS_SECRET as string,
    expiresIn: config.JWT_ACCESS_EXPIRES_IN as string,
  });

  return accessToken;
};

const changePassword = async (payload: {
  userId: string;
  oldPassword: string;
  newPassword: string;
}): Promise<void> => {
  const user = await UserModel.findById(payload.userId)
    .select('+password')
    .exec();

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatched = await UserModel.isPasswordMatched(
    payload.oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Credentials');
  }

  user.password = payload.newPassword;
  await user.save();

  return;
};

export const AuthService = {
  loginUser,
  changePassword,
};
