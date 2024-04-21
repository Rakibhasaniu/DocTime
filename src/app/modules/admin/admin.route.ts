import { Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import { adminValidationSchemas } from "./admin.validation";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getAllAdmin)
router.get('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getSingleAdmin)
router.patch('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validateRequest(adminValidationSchemas.update),AdminController.updateIntoDB)
router.delete('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.deleteFromDB)
router.delete('/:id/soft',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.softDeleteFromDB)

export const AdminRoutes = router;
