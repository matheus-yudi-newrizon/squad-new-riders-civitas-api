import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '../controller/AuthController';
import { TeacherController } from '../controller/TeacherController';
import { authMiddleware } from '../middlewares/authMiddleware';

const adminRouter = Router();
const adminController: AuthController = Container.get(AuthController);
const teacherController: TeacherController = Container.get(TeacherController);

adminRouter.post('/login', (req, res) => adminController.adminLogin(req, res));

/**
 * @route GET /teachers/all
 * @description Rota para listar todos os professores associados à escola do administrador autenticado.
 * @access Private (apenas administradores)
 * @middleware authMiddleware - Garante que o usuário está autenticado e possui permissão de administrador.
 */
adminRouter.get('/teachers/all', authMiddleware, (req, res) => teacherController.listTeachersBySchool(req, res));

export default adminRouter;
