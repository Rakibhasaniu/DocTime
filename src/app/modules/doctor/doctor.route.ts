import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { UserRole, UserStatus } from "@prisma/client";
import { DoctorController } from "./doctor.controller";


const router = Router();

router.get('/',auth(UserRole.SUPER_ADMIN),DoctorController.getAllDoctor)
// router.get('/',DoctorController.getAllDoctor)
router.get('/:id',auth(UserRole.SUPER_ADMIN),DoctorController.getSingleDoctor)
router.patch('/:id',auth(UserRole.SUPER_ADMIN),DoctorController.updateDoctorData)
router.delete('/:id',auth(UserRole.SUPER_ADMIN),DoctorController.deleteData)
// router.delete('/soft/:id',auth(UserRole.SUPER_ADMIN),DoctorController.softDeleteData)

export const DoctorRoutes = router;