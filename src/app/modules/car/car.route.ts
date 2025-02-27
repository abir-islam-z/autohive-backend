import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendFileToCludinary';
import { CarController } from './car.controller';
import {
  carUpdateValidationSchema,
  carValidationSchema,
} from './car.validation';
import { UserRoles } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(UserRoles.ADMIN),
  upload.single('image'),
  validateRequest(carValidationSchema),
  CarController.create,
);

router.get('/', CarController.findAll);

router.get('/:id', CarController.findOne);

router.patch(
  '/:id',
  auth(UserRoles.ADMIN),
  validateRequest(carUpdateValidationSchema),
  CarController.update,
);

router.delete('/:id', auth(UserRoles.ADMIN), CarController.remove);

export const CarRoutes = router;
