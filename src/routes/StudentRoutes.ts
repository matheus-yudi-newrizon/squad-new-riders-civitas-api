import { Router } from 'express';
import { Container } from 'typedi';
import { StudentController } from '../controller/StudentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateStudentDTO } from '../models/DTO/CreateStudentDTO';

const studentRoutes = Router();
const studentController: StudentController = Container.get(StudentController);
studentRoutes.post('/register', authMiddleware, validationMiddleware(CreateStudentDTO), (req, res) => studentController.create(req, res));

export default studentRoutes;
