import { Router } from 'express';
import { Container } from 'typedi';
import { ClassController } from '../controller';
import { authMiddleware, roleMiddleware, validationMiddleware } from '../middlewares';
import { CreateClassDTO } from '../models';

const classRoutes = Router();
const classController: ClassController = Container.get(ClassController);

classRoutes.post('/create', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateClassDTO), (req, res) =>
  classController.create(req, res)
);

classRoutes.get('/', authMiddleware, roleMiddleware(['admin']), (req, res) => classController.listClasses(req, res));

classRoutes.put('/:id', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateClassDTO), (req, res) =>
  classController.updateClass(req, res)
);

classRoutes.delete('/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => classController.deleteClass(req, res));

export default classRoutes;
