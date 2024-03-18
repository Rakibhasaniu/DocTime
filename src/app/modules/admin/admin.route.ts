import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get('/',AdminController.getAllAdmin);
router.get('/:id',AdminController.getSingleData);
router.patch('/:id',AdminController.updateData);
router.delete('/:id',AdminController.deleteData)
router.delete('/soft/:id',AdminController.softDeleteData)

export const AdminRoutes = router;