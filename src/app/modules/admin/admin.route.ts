import { Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import { adminValidationSchemas } from "./admin.validation";
import auth from "../../middleware/auth";
import { UserRole, UserStatus } from "@prisma/client";


const router = Router();

router.get('/',auth(UserRole.SUPER_ADMIN),AdminController.getAllAdmin)
router.get('/:id',auth(UserRole.SUPER_ADMIN),AdminController.getSingleAdmin)
router.patch('/:id',auth(UserRole.SUPER_ADMIN),validateRequest(adminValidationSchemas.updateAdminData),AdminController.updateAdminData)
router.delete('/:id',auth(UserRole.SUPER_ADMIN),AdminController.deleteData)
router.delete('/soft/:id',auth(UserRole.SUPER_ADMIN),AdminController.softDeleteData)

export const AdminRoutes = router;