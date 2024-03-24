import { Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import { adminValidationSchemas } from "./admin.validation";


const router = Router();

router.get('/',AdminController.getAllAdmin)
router.get('/:id',AdminController.getSingleAdmin)
router.patch('/:id',validateRequest(adminValidationSchemas.updateAdminData),AdminController.updateAdminData)
router.delete('/:id',AdminController.deleteData)
router.delete('/soft/:id',AdminController.softDeleteData)

export const AdminRoutes = router;