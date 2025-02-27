import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CarRoutes } from '../modules/car/car.route';
import { OrderRoutes } from '../modules/order/order.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  { path: '/cars', route: CarRoutes },
  { path: '/orders', route: OrderRoutes },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
