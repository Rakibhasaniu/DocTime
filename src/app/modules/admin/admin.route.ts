import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validation';

const router = express.Router();

router.get('/',AdminController.getAllAdmin);
router.get('/:id',AdminController.getSingleData);
router.patch('/:id',validateRequest(adminValidationSchemas.updateAdminData),AdminController.updateData);
router.delete('/:id',AdminController.deleteData)
router.delete('/soft/:id',AdminController.softDeleteData)

export const AdminRoutes = router;