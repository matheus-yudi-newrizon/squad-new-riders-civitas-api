import { Class } from 'entities/Class';
import { School } from 'entities/School';
import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';
import { NotFoundError } from '../errors/NotFoundError';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { StudentService } from '../services/StudentService';

@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  /**
   * @swagger
   * /students/register:
   *   post:
   *     summary: Cria um novo estudante
   *     description: "Este endpoint cria um novo registro de estudante vinculado a uma escola. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Students]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fullName
   *               - document
   *               - registrationNumber
   *               - studentClass
   *               - cpfGuardian
   *             properties:
   *               fullName:
   *                 type: string
   *                 description: Nome completo do estudante
   *                 example: "João da Silva"
   *               document:
   *                 type: string
   *                 description: Documento do estudante (CPF ou equivalente)
   *                 example: "123.456.789-00"
   *               registrationNumber:
   *                 type: string
   *                 description: Número de matrícula do estudante
   *                 example: "20230001"
   *               studentClass:
   *                 type: string
   *                 description: Classe ou turma do estudante
   *                 example: "5º Ano A"
   *               cpfGuardian:
   *                 type: string
   *                 description: CPF do responsável pelo estudante
   *                 example: "123.456.789-01"
   *     responses:
   *       201:
   *         description: Estudante criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Estudante criado com sucesso"
   *       400:
   *         description: Erro na requisição - dados faltando ou incorretos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "School ID não encontrado no token."
   *       409:
   *         description: Estudante já cadastrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Estudante já cadastrado"
   */
  public async create(req: Request, res: Response): Promise<Response<ICreationSucessResponse>> {
    const schoolId: number = res.locals.schoolId;
    const { body: createStudentDTO } = req;

    if (!schoolId) throw new BadRequestError('School ID não encontrado no token.');

    const school: School = await this.studentService.verifySchool(schoolId);
    if (!school) throw new BadRequestError('Escola não encontrada');

    const isDuplicate: boolean = await this.studentService.verifyStudentDuplicate(createStudentDTO.document, createStudentDTO.registrationNumber);
    if (isDuplicate) throw new ConflictError('Estudante já cadastrado');

    const studentClass: Class = await this.studentService.stringToClass(createStudentDTO.studentClass);
    if (!studentClass) throw new BadRequestError('Turma não encontrada');

    const result: ICreationSucessResponse = await this.studentService.create(createStudentDTO, studentClass, school);
    return res.status(201).json(result);
  }

  /**
   * @swagger
   * /students:
   *   get:
   *     summary: Lista todos os estudantes da escola
   *     description: "Este endpoint retorna a lista de estudantes cadastrados, podendo filtrar por nome. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Students]
   *     parameters:
   *       - in: query
   *         name: fullName
   *         description: Nome completo do estudante para filtrar os resultados
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de estudantes encontrada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Student'
   *       404:
   *         description: Nenhum estudante encontrado com os critérios fornecidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Nenhum estudante encontrado com os critérios fornecidos."
   */
  public async listStudents(req: Request, res: Response): Promise<Response> {
    const { fullName } = req.query;
    const schoolId: number = res.locals.schoolId;
    const filters = { fullName, schoolId };

    const students = await this.studentService.listStudents(filters);
    if (students.length === 0) throw new NotFoundError('Nenhum estudante encontrado com os critérios fornecidos.');

    return res.status(200).json(students);
  }

  /**
   * @swagger
   * /students/class/{classId}:
   *   get:
   *     summary: Lista os estudantes de uma classe específica
   *     description: "Este endpoint retorna a lista de estudantes de uma classe específica, com a possibilidade de filtrar por nome. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Students]
   *     parameters:
   *       - in: path
   *         name: classId
   *         description: ID da classe para filtrar os estudantes
   *         required: true
   *         schema:
   *           type: integer
   *       - in: query
   *         name: fullName
   *         description: Nome completo do estudante para filtrar os resultados
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de estudantes encontrada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Student'
   *       404:
   *         description: Nenhum estudante encontrado com os critérios fornecidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Nenhum estudante encontrado com os critérios fornecidos."
   */
  public async listStudentsByClass(req: Request, res: Response): Promise<Response> {
    const { classId } = req.params;
    const { fullName } = req.query;
    const schoolId: number = res.locals.schoolId;
    const filters = { classId, fullName, schoolId };

    const students = await this.studentService.listStudentsByClass(filters);
    if (students.length === 0) throw new NotFoundError('Nenhum estudante encontrado com os critérios fornecidos.');

    return res.status(200).json(students);
  }
}
