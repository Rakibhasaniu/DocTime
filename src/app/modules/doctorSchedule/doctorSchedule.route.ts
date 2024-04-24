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

// router.get(
//   '/my-schedules',
//   auth(ENUM_USER_ROLE.DOCTOR),
//   ScheduleController.getMySchedules
// );

// router.patch('/:id', ScheduleController.updateIntoDB);
router.post(
  '/',
  validateRequest(DoctorScheduleValidation.create),
  auth(UserRole.DOCTOR),
  ScheduleController.insertIntoDB,
);
// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.DOCTOR),
//   ScheduleController.deleteFromDB
// );

export const DoctorScheduleRoutes = router;
