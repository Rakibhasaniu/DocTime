import express from 'express';

import { ScheduleController } from './doctorSchedule.controller';
import validateRequest from '../../middleware/validateRequest';
import { DoctorScheduleValidation } from './doctorSchedule.validation';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';


const router = express.Router();
router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR,UserRole.PATIENT),
  ScheduleController.getAllFromDB);
router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR,UserRole.PATIENT),
  ScheduleController.getByIdFromDB);

router.get(
  '/my-schedules',
  auth(UserRole.DOCTOR),
  ScheduleController.getMySchedules
);

router.patch('/:id', ScheduleController.updateIntoDB);
router.post(
  '/',
  validateRequest(DoctorScheduleValidation.create),
  auth(UserRole.DOCTOR),
  ScheduleController.insertIntoDB,
);
router.delete(
  '/:id',
  auth(UserRole.DOCTOR),
  ScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;
