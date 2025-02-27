import { Request, Response } from 'express';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const createdUser = await UserService.createUser({
    name,
    email,
    password,
  });

  sendResponse(res, {
    success: true,
    message: 'User registered successfully',
    statusCode: 201,
    data: {
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken: token, refreshToken } = await AuthService.loginUser({
    email,
    password,
  });

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    message: 'Login successful',
    statusCode: 200,
    data: {
      token,
    },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;
  await AuthService.changePassword({ userId, oldPassword, newPassword });
  sendResponse(res, {
    success: true,
    message: 'Password changed successfully',
    statusCode: 200,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const token = await AuthService.refreshToken(refreshToken);
  sendResponse(res, {
    success: true,
    message: 'Token refreshed successfully',
    statusCode: 200,
    data: {
      token,
    },
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
};
