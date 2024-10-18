import { Router } from 'express';
import adminRouter from './AdminRoutes';

const router = Router();

router.use('/admin', adminRouter);

export default router;
