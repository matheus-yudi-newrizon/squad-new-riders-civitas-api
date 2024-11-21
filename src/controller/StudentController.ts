import { Class } from 'entities/Class';
import { School } from 'entities/School';
import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { UpdateStudentDTO } from '../models/DTO/UpdateStudentDTO';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { IUpdateResponse } from '../models/interfaces/IUpdateResponse';
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
   *                 description: Id da turma do estudante
   *                 example: "1"
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
   *       401:
   *         description: Acesso não autorizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             examples:
   *               tokenAusente:
   *                 summary: Token ausente
   *                 value:
   *                   message: "Token não consta na requisição."
   *               tokenInvalidoOuExpirado:
   *                 summary: Token inválido ou expirado
   *                 value:
   *                   message: "Token inválido ou expirado."
   *               tokenInvalido:
   *                 summary: Token inválido
   *                 value:
   *                    example: "Acesso autorizado"
   *       403:
   *         description: "Você não tem permissão para acessar este recurso"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Você não tem permissão para acessar este recurso"
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

    await this.studentService.verifyStudentDuplicate(createStudentDTO.document, createStudentDTO.registrationNumber);

    const studentClass: Class = await this.studentService.stringToClass(createStudentDTO.studentClass);
    if (!studentClass) throw new BadRequestError('Turma não encontrada');

    const result: ICreationSucessResponse = await this.studentService.create(createStudentDTO, studentClass, school);
    return res.status(201).json(result);
  }

  /**
   * @swagger
   * /admin/students/{id}:
   *   put:
   *     summary: Atualiza informações de um estudante
   *     description: "Este endpoint permite a atualização das informações de um estudante específico. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Admin]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID do estudante a ser atualizado
   *         required: true
   *         schema:
   *           type: integer
   *       - in: body
   *         name: body
   *         description: Dados do estudante a serem atualizados. Todos os campos são opcionais.
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 fullName:
   *                   type: string
   *                   description: Nome completo do estudante
   *                   example: "João da Silva"
   *                 document:
   *                   type: string
   *                   description: Documento do estudante (CPF ou equivalente)
   *                   example: "123.456.789-00"
   *                 registrationNumber:
   *                   type: string
   *                   description: Número de matrícula do estudante
   *                   example: "20230001"
   *                 studentClass:
   *                   type: string
   *                   description: Id da turma do estudante
   *                   example: "1"
   *                 cpfGuardian:
   *                   type: string
   *                   description: CPF do responsável pelo estudante
   *                   example: "987.654.321-00"
   *     responses:
   *       200:
   *         description: Estudante atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Dados atualizados com sucesso!"
   *       400:
   *         description: Dados faltando ou incorretos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "O campo nome é obrigatório."
   *       401:
   *         description: Acesso não autorizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Token não consta na requisição."
   *       403:
   *         description: Permissão negada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Você não tem permissão para acessar este recurso."
   *       404:
   *         description: Estudante não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Estudante não encontrado."
   *       409:
   *         description: Dados conflitantes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Estudante já cadastrado."
   */
  public async updateStudent(req: Request, res: Response): Promise<Response<IUpdateResponse>> {
    const studentId: number = Number(req.params.id);
    const updateStudentDTO: UpdateStudentDTO = req.body;

    if (!studentId) throw new BadRequestError('ID do estudante não fornecido.');

    const result: IUpdateResponse = await this.studentService.updateStudent(studentId, updateStudentDTO);
    return res.status(200).json(result);
  }

  public async deleteStudent(req: Request, res: Response): Promise<Response> {
    const studentId: number = Number(req.params.id);

    if (!studentId) throw new BadRequestError('ID do professor não fornecido.');

    await this.studentService.deleteStudent(studentId);
    return res.status(204).send();
  }

  /**
   * @swagger
   * /admin/me/students:
   *   get:
   *     summary: Lista todos os estudantes da escola
   *     description: "Este endpoint retorna a lista de estudantes cadastrados, podendo filtrar por nome. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}' e verificação de permissões de acesso."
   *     tags: [Admin]
   *     security:
   *      - bearerAuth: []
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
   *       401:
   *         description: Acesso não autorizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             examples:
   *               tokenAusente:
   *                 summary: Token ausente
   *                 value:
   *                   message: "Token não consta na requisição."
   *               tokenInvalidoOuExpirado:
   *                 summary: Token inválido ou expirado
   *                 value:
   *                   message: "Token inválido ou expirado."
   *               tokenInvalido:
   *                 summary: Token inválido
   *                 value:
   *                   message: "Token inválido."
   *       403:
   *         description: "Você não tem permissão para acessar este recurso"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Você não tem permissão para acessar este recurso."
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
    const filters: object = { fullName, schoolId };

    const students = await this.studentService.listStudents(filters);
    if (students.length === 0) throw new NotFoundError('Nenhum estudante encontrado com os critérios fornecidos.');

    return res.status(200).json(students);
  }

  /**
   * @swagger
   * /teachers/me/classes/{classId}/students:
   *   get:
   *     summary: Lista os estudantes de uma classe específica
   *     description: "Este endpoint retorna a lista de estudantes de uma classe específica, com a possibilidade de filtrar por nome. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}' e verificação de permissões de acesso."
   *     tags: [Teachers]
   *     security:
   *      - bearerAuth: []
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
   *       401:
   *         description: Acesso não autorizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             examples:
   *               tokenAusente:
   *                 summary: Token ausente
   *                 value:
   *                   message: "Token não consta na requisição."
   *               tokenInvalidoOuExpirado:
   *                 summary: Token inválido ou expirado
   *                 value:
   *                   message: "Token inválido ou expirado."
   *               tokenInvalido:
   *                 summary: Token inválido
   *                 value:
   *                   message: "Token inválido."
   *       403:
   *         description: "Você não tem permissão para acessar este recurso"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Você não tem permissão para acessar este recurso."
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
  /**
   * @swagger
   * /admin/me/classes/{classId}/students:
   *   get:
   *     summary: Lista os estudantes de uma classe específica
   *     description: "Este endpoint retorna a lista de estudantes de uma classe específica associada à escola do administrador autenticado, com a possibilidade de filtrar por nome. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}' e verificação de permissões de acesso. Administradores podem acessar esta rota para obter a lista de estudantes de qualquer classe dentro da escola que administram."
   *     tags: [Admin]
   *     security:
   *      - bearerAuth: []
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
   *       401:
   *         description: Acesso não autorizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             examples:
   *               tokenAusente:
   *                 summary: Token ausente
   *                 value:
   *                   message: "Token não consta na requisição."
   *               tokenInvalidoOuExpirado:
   *                 summary: Token inválido ou expirado
   *                 value:
   *                   message: "Token inválido ou expirado."
   *               tokenInvalido:
   *                 summary: Token inválido
   *                 value:
   *                   message: "Token inválido."
   *       403:
   *         description: "Você não tem permissão para acessar este recurso"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Você não tem permissão para acessar este recurso."
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
    const filters: object = { classId, fullName, schoolId };

    const students = await this.studentService.listStudentsByClass(filters);
    if (students.length === 0) throw new NotFoundError('Nenhum estudante encontrado com os critérios fornecidos.');

    return res.status(200).json(students);
  }
}
