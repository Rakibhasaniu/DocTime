import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";


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
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router; 