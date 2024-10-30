import { Router } from 'express';
import { ClassController } from '../controller/ClassController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateClassDTO } from '../interfaces/CreateClassDTO';

const router = Router();
const classController = new ClassController();

router.post('/create', authMiddleware, validationMiddleware(CreateClassDTO), classController.createClass);

export default router;
