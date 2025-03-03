import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { TRegister } from './auth.validation';

const registerUser = async (payload: TRegister) => {
  await UserModel.create(payload);
};

const loginUser = async (
  payload: TLoginUser,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const user = await UserModel.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const isBlocked = user.isBlocked;

  if (isBlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account has been deactivated.Please contact support !',
    );
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
    secret: config.jwt.access_secret as string,
    expiresIn: config.jwt.access_expires_in as string,
  });

  const refreshToken = createToken({
    jwtPayload,
    secret: config.jwt.refresh_secret as string,
    expiresIn: config.jwt.refresh_expires_in as string,
  });

  return {
    accessToken,
    refreshToken,
  };
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
  user.passwordChangedAt = new Date();
  await user.save();

  return;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt.refresh_secret as string);

  const { email, iat } = decoded;

  // checking if the user exists
  const user = await UserModel.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isBlocked = user?.isBlocked;

  if (isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  if (
    user.passwordChangedAt &&
    UserModel.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user._id as unknown as string,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  const accessToken = createToken({
    jwtPayload,
    secret: config.jwt.access_secret as string,
    expiresIn: config.jwt.access_expires_in as string,
  });

  return {
    accessToken,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
};
