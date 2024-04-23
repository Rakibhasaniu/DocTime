import express from 'express';
import { ScheduleValidation } from './schedule.validations';
import { ScheduleController } from './schedule.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';


const router = express.Router();
router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.getAllFromDB
);

router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.getByIdFromDB
);

// router.patch('/:id', PatientController.updateIntoDB);
router.post(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(ScheduleValidation.create),
  ScheduleController.insertIntoDB,
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.deleteFromDB
);

export const ScheduleRoutes = router;
