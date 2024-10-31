import { Router } from 'express';
import { ClassController } from '../controller/ClassController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateClassDTO } from '../models/DTO/CreateClassDTO';

const router = Router();
const classController = new ClassController();

router.post('/create', authMiddleware, validationMiddleware(CreateClassDTO), classController.createClass);

export default router;
