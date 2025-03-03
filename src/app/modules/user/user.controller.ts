import httpStatus from 'http-status';
import { BadRequestException } from '../../errors/Exceptions';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserService } from './user.service';

const findAll = catchAsync(async (req, res) => {
  const data = await UserService.getAllUsers({
    query: req.query,
  });
  sendResponse(res, {
    data: data.result,
    meta: data.meta,
    message: 'Users Retrieved Successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

const findOne = catchAsync(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);

  sendResponse(res, {
    data: user,
    message: 'User Retrieved Successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

const update = catchAsync(async (req, res) => {
  if (req.user.userId === req.params.id) {
    throw new BadRequestException('You can not update your own status or role');
  }

  await UserService.updateUser(req.params.id, req.body);

  sendResponse(res, {
    message: 'User Updated Successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const UserController = {
  findAll,
  findOne,
  update,
};
