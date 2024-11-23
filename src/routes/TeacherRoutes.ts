import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '../controller/AuthController';
import { StudentController } from '../controller/StudentController';
import { TeacherController } from '../controller/TeacherController';
import { EvaluationController } from '../controller/EvaluationController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateTeacherDTO } from '../models/DTO/CreateTeacherDTO';
import { CreateEvaluationDTO } from '../models/DTO/CreateEvaluationDTO';

const teacherRoutes = Router();
const teacherController: TeacherController = Container.get(TeacherController);
const teacherAuth: AuthController = Container.get(AuthController);
const studentController: StudentController = Container.get(StudentController);
const evaluationController: EvaluationController = Container.get(EvaluationController);

/**
 * @route POST /teachers/register
 * @description Rota para cadastro de um novo professor, exigindo autenticação e validação dos dados.
 * @access Private
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware(['admin']) - Restringe acesso a administradores.
 * @middleware validationMiddleware(CreateTeacherDTO) - Valida o payload com base no DTO fornecido.
 */
teacherRoutes.post('/register', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateTeacherDTO), (req, res) =>
  teacherController.create(req, res)
);

/**
 * @route POST /teachers/login
 * @description Rota para login de um professor, gerando um token JWT para autenticação.
 * @access Public
 */
teacherRoutes.post('/login', (req, res) => teacherAuth.teacherLogin(req, res));

/**
 * @route GET /teachers/me/classes
 * @description Rota para listar as turmas associadas ao professor autenticado.
 * @access Private
 */
teacherRoutes.get('/me/classes', authMiddleware, roleMiddleware(['teacher']), (req, res) => teacherController.listClassesByTeacher(req, res));

/**
 * @route POST /teachers/me/evaluations
 * @description Rota para cadastrar uma nova avaliação de desempenho individual (ADI).
 * @access Private
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware(['teacher']) - Restringe acesso a professores.
 * @middleware validationMiddleware(CreateEvaluationDTO) - Valida o payload com base no DTO fornecido.
 */
teacherRoutes.post('/me/evaluations', authMiddleware, roleMiddleware(['teacher']), validationMiddleware(CreateEvaluationDTO), (req, res) =>
  evaluationController.create(req, res)
);

/**
 * @route GET /teachers
 * @description Rota para buscar as informações do professor autenticado usando o token JWT.
 * @access Private
 */
teacherRoutes.get('/', authMiddleware, roleMiddleware(['teacher']), (req, res) => teacherController.getTeacherById(req, res));

/**
 * @route GET /teachers/me/classes/:classId/students
 * @description Esta rota recupera todos os estudantes de uma classe específica. Requer autenticação.
 * @access Private
 */
teacherRoutes.get('/me/classes/:classId/students', authMiddleware, roleMiddleware(['teacher']), (req, res) =>
  studentController.listStudentsByClass(req, res)
);

export default teacherRoutes;
