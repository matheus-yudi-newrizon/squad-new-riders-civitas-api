import { Router } from 'express';
import { AdminController } from '../controller/AdminController';

const router = Router();
const adminController = new AdminController();
router.post('/admin', adminController.create);
export default router;
