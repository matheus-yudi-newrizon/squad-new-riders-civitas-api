import { Router } from 'express';
import { Container } from 'typedi';
import { ClassController } from '../controller/ClassController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateClassDTO } from '../models/DTO/CreateClassDTO';

const classRoutes = Router();
const classController: ClassController = Container.get(ClassController);

classRoutes.post('/create', authMiddleware, validationMiddleware(CreateClassDTO), (req, res) => classController.create(req, res));

export default classRoutes;
