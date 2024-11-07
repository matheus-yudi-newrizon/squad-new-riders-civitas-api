import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '../controller/AuthController';
import { TeacherController } from '../controller/TeacherController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateTeacherDTO } from '../models/DTO/CreateTeacherDTO';

const teacherRoutes = Router();
const teacherController: TeacherController = Container.get(TeacherController);
const teacherAuth: AuthController = Container.get(AuthController);

/**
 * @route POST /teachers/register
 * @description Rota para cadastro de um novo professor, exigindo autenticação e validação dos dados.
 * @access Private
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware validationMiddleware(CreateTeacherDTO) - Valida o payload com base no DTO fornecido.
 */
teacherRoutes.post('/register', authMiddleware, validationMiddleware(CreateTeacherDTO), (req, res) => teacherController.create(req, res));
teacherRoutes.post('/login', (req, res) => teacherAuth.teacherLogin(req, res));

/**
 * @route GET /teachers/me/classes
 * @description Rota para listar as turmas associadas ao professor autenticado.
 * @access Private
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 */
teacherRoutes.get('/me/classes', authMiddleware, (req, res) => teacherController.listClassesByTeacher(req, res));

export default teacherRoutes;
