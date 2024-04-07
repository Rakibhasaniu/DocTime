import { Router } from "express";
import { DoctorSchedulesController } from "./doctorSchedule.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();


router.post('/',auth(UserRole.DOCTOR),DoctorSchedulesController.insertIntoDB)


export const DoctorScheduleRoutes = router;