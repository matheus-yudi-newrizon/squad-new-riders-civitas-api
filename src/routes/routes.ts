import { Router } from 'express';
import { Container } from 'typedi';
import { AdminController } from '../controller/AdminController';

const router = Router();
const adminController: AdminController = Container.get(AdminController);

router.post('/admin/login', (req, res) => adminController.login(req, res));

export default router;
