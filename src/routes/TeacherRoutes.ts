import { Router } from 'express';
import { Container } from 'typedi';
import { TeacherController } from '../controller/TeacherController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateTeacherDTO } from '../models/DTO/CreateTeacherDTO';

const teacherRoutes = Router();
const teacherController: TeacherController = Container.get(TeacherController);

teacherRoutes.post('/register', authMiddleware, validationMiddleware(CreateTeacherDTO), (req, res) => teacherController.create(req, res));

export default teacherRoutes;
