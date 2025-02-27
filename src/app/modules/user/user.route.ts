import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from './user.constant';
import { UserController } from './user.controller';
import { userValidationSchema } from './user.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRoles.ADMIN),
  validateRequest(userValidationSchema),
  UserController.create,
);

router.get('/', auth(UserRoles.ADMIN), UserController.findAll);
router.get('/:userId', auth(UserRoles.ADMIN), UserController.findOne);

router.patch(
  '/:userId',
  auth(UserRoles.ADMIN),
  validateRequest(userValidationSchema),
  UserController.update,
);
router.delete('/:userId', auth(UserRoles.ADMIN), UserController.remove);

export const UserRoutes = router;
