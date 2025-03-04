import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendFileToCludinary';
import { CarController } from './car.controller';

import { UserRoles } from '../user/user.constant';
import { CarValidation } from './car.validation';

const router = Router();

router.post(
  '/',
  auth(UserRoles.ADMIN),
  upload.array('images'),
  validateRequest(CarValidation.createCarSchema),
  CarController.create,
);

router.get('/brands', CarController.getBrandsAndModels);
router.get('/:id', CarController.findOne);
router.get('/', CarController.findAll);

router.patch(
  '/:id',
  auth(UserRoles.ADMIN),
  validateRequest(CarValidation.updateCarSchema),
  CarController.update,
);

router.delete('/:id', auth(UserRoles.ADMIN), CarController.remove);

export const CarRoutes = router;
