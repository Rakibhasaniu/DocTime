import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";


const router = Router();


const moduleRoutes = [
    {
        path:'/user',
        route:UserRoutes
    },
    {
        path:'/admin',
        route:AdminRoutes
    },
]

moduleRoutes.forEach((route) =>router.use(route.path,route.route));


export default router;