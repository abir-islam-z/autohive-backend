import { Request, Response } from 'express';
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
  const token = await AuthService.loginUser({ email, password });
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

export const AuthController = {
  registerUser,
  loginUser,
  changePassword,
};
