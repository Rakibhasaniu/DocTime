import { Router } from "express";
import { SchedulesController } from "./schedule.controller";



const router = Router();


router.post('/',SchedulesController.insertIntoDB)

export const SchedulesRoutes = router