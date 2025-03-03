import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from '../user/user.constant';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = Router();

router.post(
  '/',
  auth(UserRoles.USER),
  validateRequest(OrderValidation.createOrder),
  OrderController.create,
);
router.get('/', auth(UserRoles.ADMIN, UserRoles.USER), OrderController.findAll);
router.get('/verify', auth(UserRoles.USER), OrderController.verifyPayment);
router.get('/user', auth(UserRoles.USER), OrderController.findUserOrders);
router.get('/:id', auth(UserRoles.ADMIN), OrderController.findOne);

router.patch(
  '/:id',
  auth(UserRoles.ADMIN),
  validateRequest(OrderValidation.updateOrder),
  OrderController.update,
);

router.delete('/:id', auth(UserRoles.ADMIN), OrderController.remove);

export const OrderRoutes = router;
