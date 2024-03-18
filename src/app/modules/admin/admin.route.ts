import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get('/',AdminController.getAllAdmin);
router.get('/:id',AdminController.getSingleData);

export const AdminRoutes = router;