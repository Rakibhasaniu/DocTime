import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.route";


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
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router; 