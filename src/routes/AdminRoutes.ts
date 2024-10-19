import { Router } from 'express';
import { Container } from 'typedi';
import { AdminController } from '../controller/AdminController';

const adminRouter = Router();
const adminController: AdminController = Container.get(AdminController);

adminRouter.post('/login', (req, res) => adminController.login(req, res));

export default adminRouter;
