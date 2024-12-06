import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError, NotFoundError } from '../errors';
import { CreateTeacherDTO, ISuccessResponse, ITeacherMap, UpdateTeacherDTO } from '../models';
import { TeacherService } from '../services';

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
  public async create(req: Request, res: Response): Promise<Response<ISuccessResponse>> {
    const schoolId: number = res.locals.schoolId;
    const createTeacherDTO: CreateTeacherDTO = req.body;

    if (!schoolId) throw new BadRequestError('School ID não encontrado no token.');

    const result = await this.teacherService.createTeacherWithValidation(createTeacherDTO, schoolId);
    return res.status(201).json(result);
  }

  /**
   * @swagger
   * /admin/teachers/{id}:
   *   put:
   *     summary: Atualiza os dados de um professor
   *     description: "Este endpoint atualiza as informações de um professor, como nome, CPF, número de matrícula e associações com turmas."
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do professor a ser atualizado
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTeacherDTO'
   *     responses:
   *       200:
   *         description: Dados do professor atualizados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Dados do professor atualizados com sucesso."
   *                 data:
   *                   $ref: '#/components/schemas/IUpdateResponse'
   *       400:
   *         description: ID do professor não fornecido ou dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "ID do professor não fornecido."
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
   *                   example: "Você não tem permissão para acessar este recurso"
   *       404:
   *         description: Professor não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Professor não encontrado."
   *       409:
   *         description: Conflito de dados (CPF ou matrícula duplicados)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "O número de matrícula já está em uso para esta escola."
   */
  public async updateTeacher(req: Request, res: Response): Promise<Response<ISuccessResponse>> {
    const teacherId: number = Number(req.params.id);
    const schoolId: number = res.locals.schoolId;
    const updateTeacherDTO: UpdateTeacherDTO = req.body;

    if (!teacherId) throw new BadRequestError('ID do professor não fornecido.');

    const result: ISuccessResponse = await this.teacherService.updateTeacher(teacherId, schoolId, updateTeacherDTO);
    return res.status(200).json(result);
  }

  /**
   * @swagger
   * /admin/teachers/{id}:
   *   delete:
   *     summary: Remove um professor
   *     description: "Este endpoint exclui um professor e remove suas associações com escola e turmas."
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do professor a ser removido
   *     responses:
   *       204:
   *         description: Professor removido com sucesso
   *       400:
   *         description: ID do professor não fornecido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "ID do professor não fornecido."
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
   *                   example: "Você não tem permissão para acessar este recurso"
   *       404:
   *         description: Professor não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Professor não encontrado nesta escola."
   */
  public async deleteTeacher(req: Request, res: Response): Promise<Response> {
    const teacherId: number = Number(req.params.id);
    const schoolId: number = res.locals.schoolId;

    if (!teacherId) throw new BadRequestError('ID do professor não fornecido.');

    await this.teacherService.deleteTeacher(teacherId, schoolId);
    return res.status(204).send();
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
   * /teachers/:
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

    const teacher = await this.teacherService.getTeacherInfo(teacherId);
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
   *     parameters:
   *       - in: query
   *         name: fullName
   *         required: false
   *         schema:
   *           type: string
   *         description: "Filtra os professores pelo nome. Se fornecido, apenas os professores cujo nome contém o valor especificado serão retornados."
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
    const fullName = req.query.fullName as string;
    if (!schoolId) throw new BadRequestError('ID da escola não encontrado no token.');

    const teachers = await this.teacherService.listTeachersBySchoolWithClasses(schoolId, fullName);

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

  /**
   * @swagger
   * /teachers/{id}:
   *   get:
   *     summary: Busca um professor pelo id
   *     description: "Este endpoint permite buscar as informações de um professor específico pelo seu id."
   *     tags: [Teachers]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Informações do professor.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 2
   *                 fullName:
   *                   type: string
   *                   example: "Maria da Silva"
   *                 cpf:
   *                   type: string
   *                   example: "446.354.320-76"
   *                 teacherClasses:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       class:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                             example: 1
   *                 registrationNumber:
   *                   type: string
   *                   example: "REG123"
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
   *                   example: "Você não tem permissão para acessar este recurso"
   *       400:
   *         description: ID do professor não fornecido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "ID do professor não fornecido."
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
  public async getTeacherInfo(req: Request, res: Response): Promise<Response<ITeacherMap>> {
    const teacherId: number = Number(req.params.id);
    if (!teacherId) throw new BadRequestError('ID do professor não fornecido.');
    const schoolId: number = res.locals.schoolId;
    if (!schoolId) throw new BadRequestError('ID da escola não encontrado no token.');
    const teacher: ITeacherMap = await this.teacherService.getTeacherInfo(teacherId, schoolId);
    return res.status(200).json(teacher);
  }
}
