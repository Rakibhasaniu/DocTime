import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.post('/create-appointment',auth(UserRole.PATIENT),AppointmentController.createAppointment)


export const AppointmentRoutes = router; 