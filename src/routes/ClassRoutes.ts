import { Router } from 'express';
import { ClassController } from '../controller/ClassController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const classController = new ClassController();


router.post('/create', authMiddleware, classController.createClass);

export default router;
