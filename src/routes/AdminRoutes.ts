import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '../controller/AuthController';

const adminRouter = Router();
const adminController: AuthController = Container.get(AuthController);

adminRouter.post('/login', (req, res) => adminController.adminLogin(req, res));

export default adminRouter;
