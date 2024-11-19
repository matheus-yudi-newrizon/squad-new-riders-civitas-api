import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '../controller/AuthController';
import { StudentController } from '../controller/StudentController';
import { TeacherController } from '../controller/TeacherController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const adminRouter = Router();
const adminController: AuthController = Container.get(AuthController);
const teacherController: TeacherController = Container.get(TeacherController);
const studentController: StudentController = Container.get(StudentController);

/**
 * @route POST /admin/login
 * @description Rota para autenticar um administrador e gerar um token JWT.
 * @access Public
 */
adminRouter.post('/login', (req, res) => adminController.adminLogin(req, res));

/**
 * @route GET /teachers/all
 * @description Rota para listar todos os professores associados à escola do administrador autenticado.
 * @access Private (apenas administradores)
 * @middleware authMiddleware - Garante que o usuário está autenticado e possui permissão de administrador.
 * @middleware roleMiddleware(['admin']) - Restringe acesso a administradores.
 */
adminRouter.get('/teachers/all', authMiddleware, roleMiddleware(['admin']), (req, res) => teacherController.listTeachersBySchool(req, res));

/**
 * @route GET /admin/me/students
 * @description Rota para listar todos os alunos associados à escola do administrador autenticado.
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware(['admin']) - Restringe acesso a administradores.
 * @access Private
 */
adminRouter.get('/me/students', authMiddleware, roleMiddleware(['admin']), (req, res) => studentController.listStudents(req, res));

/**
 * @route GET /admin/me/classes/:id/students
 * @description Rota para listar todos os alunos de uma turma específica associada à escola do administrador autenticado.
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware(['admin']) - Restringe acesso a administradores.
 * @access Private
 */
adminRouter.get('/me/classes/:id/students', authMiddleware, roleMiddleware(['admin']), (req, res) => studentController.listStudents(req, res));

export default adminRouter;
