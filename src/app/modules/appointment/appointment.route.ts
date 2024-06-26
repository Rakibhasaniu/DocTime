import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get('/my-appointment',auth(UserRole.PATIENT,UserRole.DOCTOR),AppointmentController.getMyAppointment)

router.post('/create-appointment',auth(UserRole.PATIENT),AppointmentController.createAppointment)


router.patch('/status/:id',auth(UserRole.SUPER_ADMIN,UserRole.ADMIN,UserRole.DOCTOR),AppointmentController.changeAppointmentStatus)


export const AppointmentRoutes = router; 