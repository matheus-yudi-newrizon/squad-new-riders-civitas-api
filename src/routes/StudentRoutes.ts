import { Router } from 'express';
import { Container } from 'typedi';
import { StudentController } from '../controller/StudentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const studentRoutes = Router();
const studentController: StudentController = Container.get(StudentController);
studentRoutes.post('/register', authMiddleware, (req, res) => studentController.create(req, res));

export default studentRoutes;
