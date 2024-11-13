import { Router } from 'express';
import { Container } from 'typedi';
import { StudentController } from '../controller/StudentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateStudentDTO } from '../models/DTO/CreateStudentDTO';

const studentRoutes = Router();
const studentController: StudentController = Container.get(StudentController);

/**
 * @route POST /register
 * @description Esta rota registra um novo estudante. Requer autenticação e valida o corpo da requisição contra CreateStudentDTO.
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware validationMiddleware(CreateStudentDTO) - Valida o corpo da requisição.
 */
studentRoutes.post('/register', authMiddleware, validationMiddleware(CreateStudentDTO), (req, res) => studentController.create(req, res));

/**
 * @route GET /
 * @description Esta rota recupera todos os estudantes. Requer autenticação.
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 */
studentRoutes.get('/', authMiddleware, (req, res) => studentController.listStudents(req, res));

/**
 * @route GET /class/:classId
 * @description Esta rota recupera todos os estudantes de uma classe específica. Requer autenticação.
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 */
studentRoutes.get('/class/:classId', authMiddleware, (req, res) => studentController.listStudentsByClass(req, res));

export default studentRoutes;
