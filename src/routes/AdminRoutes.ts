import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController, StudentController, TeacherController } from '../controller';
import { authMiddleware, roleMiddleware, validationMiddleware } from '../middlewares';
import { UpdateStudentDTO, UpdateTeacherDTO } from '../models';

const adminRouter = Router();
const adminController: AuthController = Container.get(AuthController);
const teacherController: TeacherController = Container.get(TeacherController);
const studentController: StudentController = Container.get(StudentController);

adminRouter.post('/login', (req, res) => adminController.adminLogin(req, res));

adminRouter.get('/teachers/all', authMiddleware, roleMiddleware(['admin']), (req, res) => teacherController.listTeachersBySchool(req, res));

adminRouter.get('/me/students', authMiddleware, roleMiddleware(['admin']), (req, res) => studentController.listStudents(req, res));

adminRouter.get('/me/classes/:classId/students', authMiddleware, roleMiddleware(['admin']), (req, res) =>
  studentController.listStudentsByClass(req, res)
);

adminRouter.put('/teachers/:id', authMiddleware, roleMiddleware(['admin']), validationMiddleware(UpdateTeacherDTO), (req, res) =>
  teacherController.updateTeacher(req, res)
);

adminRouter.delete('/teachers/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => teacherController.deleteTeacher(req, res));

adminRouter.put('/students/:id', authMiddleware, roleMiddleware(['admin']), validationMiddleware(UpdateStudentDTO), (req, res) =>
  studentController.updateStudent(req, res)
);

adminRouter.delete('/students/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => studentController.deleteStudent(req, res));

export default adminRouter;
