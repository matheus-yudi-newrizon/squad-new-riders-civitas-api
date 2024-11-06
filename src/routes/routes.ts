import { Router } from 'express';
import adminRouter from './AdminRoutes';
import classRoutes from './ClassRoutes';
import studentRoutes from './StudentRoutes';
import teacherRoutes from './TeacherRoutes';

const router = Router();

router.use('/admin', adminRouter);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);

export default router;
