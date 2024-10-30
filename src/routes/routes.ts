import { Router } from 'express';
import adminRouter from './AdminRoutes';
import classRoutes from './ClassRoutes';
import studentRoutes from './StudentRoutes';

const router = Router();

router.use('/admin', adminRouter);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);

export default router;
