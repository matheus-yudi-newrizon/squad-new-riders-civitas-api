import { Router } from 'express';
import { Container } from 'typedi';
import { StudentController } from '../controller';
import { authMiddleware, roleMiddleware, validationMiddleware } from '../middlewares';
import { CreateStudentDTO } from '../models';

const studentRoutes = Router();
const studentController: StudentController = Container.get(StudentController);

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

export default studentRoutes;
