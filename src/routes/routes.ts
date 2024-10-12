import { Router } from 'express';
import { HomeController } from '../controller/HomeController';
import adminRoutes from './adminRoutes';

const router = Router();

router.get('/', new HomeController().hello);

router.use(adminRoutes);

export default router;
