import { Router } from 'express';
import adminRouter from './AdminRoutes';
import classRoutes from './ClassRoutes';

const router = Router();

router.use('/admin', adminRouter);
router.use('/turmas', classRoutes);

export default router;
