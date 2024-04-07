import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { SchedulesRoutes } from "../modules/schedule/schedule.route";


const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route:userRoutes
    },
    {
        path: "/admin",
        route:AdminRoutes
    },
    {
        path: "/auth",
        route:AuthRoutes
    },
    {
        path: "/specialties",
        route:SpecialtiesRoutes
    },
    {
        path: "/doctor",
        route:DoctorRoutes
    },
    {
        path: "/patient",
        route:PatientRoutes
    },
    {
        path: "/schedule",
        route:SchedulesRoutes
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router; 