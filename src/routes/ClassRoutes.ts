import { Router } from 'express';
import { ClassController } from '../controller/ClassController';

const router = Router();
const classController = new ClassController();

router.post('/create', classController.createClass);

export default router;
