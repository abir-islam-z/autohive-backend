import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from './user.constant';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', auth(UserRoles.ADMIN), UserController.findAll);
router.get('/:id', auth(UserRoles.ADMIN), UserController.findOne);

router.patch(
  '/:id',
  auth(UserRoles.ADMIN),
  validateRequest(UserValidation.updateUserStatus),
  UserController.update,
);

export const UserRoutes = router;
