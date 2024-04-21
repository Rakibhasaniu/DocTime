import express from 'express'
import { DoctorController } from './doctor.controller';
import { UserRole } from '@prisma/client';

import { DoctorValidation } from './doctor.validation';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

// task 3
router.get('/', DoctorController.getAllFromDB);

//task 4
router.get('/:id', DoctorController.getByIdFromDB);

router.patch(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    validateRequest(DoctorValidation.update),
    DoctorController.updateIntoDB
);

//task 5
router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.deleteFromDB
);

// task 6
router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDelete);

export const DoctorRoutes = router