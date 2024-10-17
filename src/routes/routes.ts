import { Router } from 'express';
import { AdminController } from '../controller/AdminController';

const router = Router();

router.post('/admin/login', new AdminController().login);

export default router;
