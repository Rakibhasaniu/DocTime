import { Router } from "express";
import { SchedulesController } from "./schedule.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";



const router = Router();


router.post('/',SchedulesController.insertIntoDB)

export const SchedulesRoutes = router