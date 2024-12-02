import { Router } from 'express';
import { Container } from 'typedi';
import { EvaluationController, StudentController } from '../controller';
import { authMiddleware, roleMiddleware, validationMiddleware } from '../middlewares';
import { CreateStudentDTO } from '../models';

const studentRoutes = Router();
const studentController: StudentController = Container.get(StudentController);
const evaluationController: EvaluationController = Container.get(EvaluationController);

/**
 * @route POST /students/register
 * @description Esta rota registra um novo estudante. Requer autenticação e valida o corpo da requisição contra CreateStudentDTO.
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware['admin'] - Restringe acesso a administradores.
 * @middleware validationMiddleware(CreateStudentDTO) - Valida o corpo da requisição.
 * @access Private
 */
studentRoutes.post('/register', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateStudentDTO), (req, res) =>
  studentController.create(req, res)
);

/**
 * @route GET /students/evaluations/:evaluationId/show
 * @description Esta rota retorna os detalhes de uma avaliação específica. Requer autenticação e valida se o usuário tem permissão para acessar a rota.
 * @param {number} evaluationId - ID único da avaliação fornecido como parâmetro na URL.
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware['teacher'] - Restringe acesso a professores.
 * @access Private
 */
studentRoutes.get('/evaluations/:evaluationId/show', authMiddleware, roleMiddleware(['teacher']), (req, res) =>
  evaluationController.getEvaluation(req, res)
);

export default studentRoutes;
