import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { TeacherService } from '../services/TeacherService';
import { CreateTeacherDTO } from '../models/DTO/CreateTeacherDTO';

@Controller()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  /**
   * @swagger
   * /teachers/register:
   *   post:
   *     summary: Cadastra um novo professor
   *     description: "Este endpoint cria um novo registro de professor vinculado a uma escola. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Teachers]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTeacherDTO'
   *     responses:
   *       201:
   *         description: Cadastro realizado com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cadastro de professor realizado com sucesso."
   *       400:
   *         description: Erro na requisição - dados faltando ou incorretos.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erro na requisição - dados faltando ou incorretos."
   *       409:
   *         description: Conflito de cadastro.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "O professor já está cadastrado com este CPF ou número de matrícula nesta escola."
   */
  public async create(req: Request, res: Response): Promise<Response<ICreationSucessResponse>> {
    const schoolId: number = res.locals.schoolId;
    const createTeacherDTO: CreateTeacherDTO = req.body;

    if (!schoolId) throw new BadRequestError('School ID não encontrado no token.');

    const result = await this.teacherService.createTeacherWithValidation(createTeacherDTO, schoolId);
    return res.status(201).json(result);
  }

  /**
   * @swagger
   * /teachers/me/classes:
   *   get:
   *     summary: Lista as turmas associadas a um professor
   *     description: "Este endpoint lista todas as turmas associadas a um professor específico. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Teachers]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de turmas associadas ao professor.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Class'
   *       404:
   *         description: Nenhuma turma encontrada para o professor especificado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Nenhuma turma encontrada para o professor especificado."
   */
  public async listClassesByTeacher(req: Request, res: Response): Promise<Response> {
    const teacherId: number = res.locals.teacherId;

    if (!teacherId) throw new BadRequestError('ID do professor não encontrado no token.');

    const classes = await this.teacherService.listClassesByTeacher(teacherId);
    return res.status(200).json(classes);
  }

  /**
   * @swagger
   * /teachers:
   *   get:
   *     summary: Busca um professor pelo token
   *     description: "Este endpoint permite buscar as informações de um professor específico pelo seu token JWT. O token é decodificado, e o `teacherId` é extraído para realizar a busca."
   *     tags: [Teachers]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Informações do professor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Teacher'
   *       404:
   *         description: Professor não encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Professor não encontrado."
   */
  public async getTeacherById(req: Request, res: Response): Promise<Response> {
    const teacherId: number = res.locals.teacherId;

    const teacher = await this.teacherService.getTeacherById(teacherId);
    if (!teacher) throw new NotFoundError('Professor não encontrado.');
    return res.status(200).json(teacher);
  }

  /**
   * @swagger
   * /teachers/all:
   *   get:
   *     summary: Lista todos os professores associados à escola do administrador
   *     description: "Este endpoint lista todos os professores associados à escola do administrador autenticado, incluindo as turmas associadas a cada professor. Requer um token JWT no cabeçalho Authorization."
   *     tags: [Teachers]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de professores com suas turmas.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: number
   *                   fullName:
   *                     type: string
   *                   registrationNumber:
   *                     type: string
   *                   classes:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: number
   *                         name:
   *                           type: string
   *       404:
   *         description: Nenhum professor encontrado para a escola especificada.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Nenhum professor encontrado para a escola especificada."
   */
  public async listTeachersBySchool(req: Request, res: Response): Promise<Response> {
    const schoolId = res.locals.schoolId;

    if (!schoolId) throw new BadRequestError('ID da escola não encontrado no token.');

    const teachers = await this.teacherService.listTeachersBySchoolWithClasses(schoolId);

    const formattedTeachers = teachers.map(teacher => ({
      id: teacher.id,
      fullName: teacher.fullName,
      registrationNumber: teacher.teacherSchools[0]?.registrationNumber,
      classes: teacher.teacherClasses.map(tc => ({
        id: tc.class.id,
        name: tc.class.name
      }))
    }));

    return res.status(200).json(formattedTeachers);
  }
}
