import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController, EvaluationController, StudentController } from '../controller';
import { authMiddleware, roleMiddleware, validationMiddleware } from '../middlewares';
import { CreateStudentDTO } from '../models';

const studentRoutes = Router();
const studentController: StudentController = Container.get(StudentController);
const evaluationController: EvaluationController = Container.get(EvaluationController);
const authController: AuthController = Container.get(AuthController);

studentRoutes.post('/register', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateStudentDTO), (req, res) =>
  studentController.create(req, res)
);

studentRoutes.post('/guardian-login', (req, res) => authController.guardianLogin(req, res));

studentRoutes.get('/evaluations/:evaluationId/show', authMiddleware, roleMiddleware(['teacher', 'admin']), (req, res) =>
  evaluationController.getEvaluation(req, res)
);

studentRoutes.get('/students/:studentId/details', authMiddleware, roleMiddleware(['teacher', 'admin']), (req, res) =>
  studentController.getStudentDetails(req, res)
);

studentRoutes.get('/:id', authMiddleware, roleMiddleware(['teacher', 'admin']), (req, res) => studentController.getStudentInfo(req, res));
export default studentRoutes;
