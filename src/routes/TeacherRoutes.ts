import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController, StudentController, TeacherController } from '../controller';
import { EvaluationController } from '../controller/EvaluationController';
import { authMiddleware, roleMiddleware, validationMiddleware } from '../middlewares';
import { CreateTeacherDTO } from '../models';
import { CreateEvaluationDTO } from '../models/DTO/CreateEvaluationDTO';

const teacherRoutes = Router();
const teacherController: TeacherController = Container.get(TeacherController);
const teacherAuth: AuthController = Container.get(AuthController);
const studentController: StudentController = Container.get(StudentController);
const evaluationController: EvaluationController = Container.get(EvaluationController);

teacherRoutes.post('/register', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateTeacherDTO), (req, res) =>
  teacherController.create(req, res)
);

teacherRoutes.post('/login', (req, res) => teacherAuth.teacherLogin(req, res));

teacherRoutes.get('/me/classes', authMiddleware, roleMiddleware(['teacher']), (req, res) => teacherController.listClassesByTeacher(req, res));

teacherRoutes.post('/me/evaluations', authMiddleware, roleMiddleware(['teacher']), validationMiddleware(CreateEvaluationDTO), (req, res) =>
  evaluationController.create(req, res)
);

teacherRoutes.get('/', authMiddleware, roleMiddleware(['teacher']), (req, res) => teacherController.getTeacherById(req, res));

teacherRoutes.get('/me/classes/:classId/students', authMiddleware, roleMiddleware(['teacher']), (req, res) =>
  studentController.listStudentsByClass(req, res)
);

teacherRoutes.get('/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => teacherController.getTeacherInfo(req, res));
export default teacherRoutes;
