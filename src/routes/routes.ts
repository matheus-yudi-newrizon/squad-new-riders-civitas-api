import { Router } from 'express';
import { HomeController } from '../controller/HomeController';
import classRoutes from './ClassRoutes';

const router = Router();

router.get('/', new HomeController().hello);
router.use('/classes', classRoutes);

export default router;
