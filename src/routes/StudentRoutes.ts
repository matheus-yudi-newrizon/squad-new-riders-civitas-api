import { Router } from 'express';
import { Container } from 'typedi';
import { StudentController } from '../controller/StudentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateStudentDTO } from '../models/DTO/CreateStudentDTO';

const studentRoutes = Router();
const studentController: StudentController = Container.get(StudentController);

/**
 * @route POST /students/register
 * @description Esta rota registra um novo estudante. Requer autenticação e valida o corpo da requisição contra CreateStudentDTO.
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware validationMiddleware(CreateStudentDTO) - Valida o corpo da requisição.
 * @access Private
 */
studentRoutes.post('/register', authMiddleware, validationMiddleware(CreateStudentDTO), (req, res) => studentController.create(req, res));

export default studentRoutes;
