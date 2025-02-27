import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from '../user/user.constant';
import { OrderController } from './order.controller';
import { orderValidationSchema } from './order.validation';

const router = Router();

router.post(
  '/',
  auth(UserRoles.USER),
  validateRequest(orderValidationSchema),
  OrderController.create,
);

router.get('/verify', auth(UserRoles.USER), OrderController.verifyPayment);
// my orders

router.get('/', auth(UserRoles.ADMIN, UserRoles.USER), OrderController.findAll);

router.get(
  '/:id',
  auth(UserRoles.ADMIN, UserRoles.USER),
  OrderController.findOne,
);

router.patch('/:id', auth(UserRoles.ADMIN), OrderController.update);

router.delete('/:id', auth(UserRoles.ADMIN), OrderController.remove);

export const OrderRoutes = router;
