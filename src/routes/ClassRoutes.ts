import { Router } from 'express';
import { ClassController } from '../controller/ClassController';

const router = Router();
const classController = new ClassController();

router.post('/cadastro', classController.cadastrarTurma);

export default router;
