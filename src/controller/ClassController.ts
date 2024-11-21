import { Request, Response } from 'express';
import { IUpdateResponse } from 'models/interfaces/IUpdateResponse';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { CreateClassDTO } from '../models/DTO/CreateClassDTO';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { ClassService } from '../services/ClassService';

@Controller()
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  /**
   * @swagger
   * /classes/create:
   *   post:
   *     summary: Cadastrar uma nova turma
   *     description: "Este endpoint permite criar uma nova turma associada a uma escola com os campos `name`, `schoolYear`, `schoolShift`, e `educationType`. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Classes]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateClassDTO'
   *     responses:
   *       201:
   *         description: "Cadastro realizado com sucesso."
   *       400:
   *         description: "Erro na requisição - dados faltando ou incorretos"
   *       404:
   *         description: "Escola não encontrada."
   *       409:
   *         description: "O apelido da turma já existe para as seleções feitas."
   */
  public async create(req: Request, res: Response): Promise<Response<ICreationSucessResponse>> {
    const schoolId = res.locals.schoolId;
    const createClassDTO: CreateClassDTO = req.body;

    if (!schoolId) throw new BadRequestError('School ID não encontrado no token.');

    const result = await this.classService.createClassWithValidation(createClassDTO, schoolId);
    return res.status(201).json(result);
  }

  /**
   * @swagger
   * /classes:
   *   get:
   *     summary: Lista todas as turmas associadas a uma escola com filtros opcionais
   *     description: "Permite listar todas as turmas associadas à escola do administrador com filtros opcionais por ano, turno e tipo de ensino."
   *     tags: [Classes]
   *     parameters:
   *       - in: query
   *         name: schoolYear
   *         required: false
   *         schema:
   *           type: string
   *         description: "Ano escolar para filtrar as turmas"
   *       - in: query
   *         name: educationType
   *         required: false
   *         schema:
   *           type: string
   *         description: "Tipo de educação para filtrar as turmas"
   *       - in: query
   *         name: schoolShift
   *         required: false
   *         schema:
   *           type: string
   *         description: "Turno escolar para filtrar as turmas"
   *     responses:
   *       200:
   *         description: "Lista de turmas filtrada."
   *       404:
   *         description: "Nenhuma turma encontrada com os critérios fornecidos."
   */
  public async listClasses(req: Request, res: Response): Promise<Response> {
    const { schoolYear, educationType, schoolShift } = req.query;
    const schoolId = res.locals.schoolId;

    const classes = await this.classService.listClasses({
      schoolYear: schoolYear as string,
      educationType: educationType as string,
      schoolShift: schoolShift as string,
      schoolId
    });

    if (classes.length === 0) throw new NotFoundError('Nenhuma turma encontrada com os critérios fornecidos.');
    return res.status(200).json(classes);
  }

  /**
   * @swagger
   * /classes/{id}:
   *   put:
   *     summary: Atualiza uma turma existente
   *     description: "Permite atualizar os dados de uma turma existente. Caso os dados fornecidos sejam inválidos ou conflitantes, um erro apropriado será retornado."
   *     tags: [Classes]
   *     security:
   *      - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID da turma a ser atualizada
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       description: "Dados atualizados da turma"
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: "Nome da turma"
   *               schoolYear:
   *                 type: string
   *                 description: "Ano escolar da turma"
   *               educationType:
   *                 type: string
   *                 description: "Tipo de educação da turma"
   *               schoolShift:
   *                 type: string
   *                 description: "Turno escolar da turma"
   *     responses:
   *       200:
   *         description: Dados da turma atualizados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Dados da turma atualizados!"
   *       400:
   *         description: Erros de validação nos dados fornecidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erro de validação nos dados fornecidos."
   *                 example: "email@example.com"
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
   *             example: "Acesso autorizado"
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
   *         description: Turma não encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Turma não encontrada."
   *       409:
   *         description: Conflito nas informações fornecidas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Verifique as informações digitadas ou cadastre novos dados."
   */

  public async updateClass(req: Request, res: Response): Promise<Response<IUpdateResponse>> {
    const classId: number = Number(req.params.id);
    const updateClassDTO: CreateClassDTO = req.body;

    const result: IUpdateResponse = await this.classService.updateClass(classId, updateClassDTO);
    return res.status(200).json(result);
  }

  /**
   * @swagger
   * /classes/{id}:
   *   delete:
   *     summary: Deleta uma turma específica
   *     description: "Permite deletar uma turma específica com base no ID fornecido. Caso a turma tenha associações com estudantes ou professores, a exclusão não será permitida."
   *     tags: [Classes]
   *     security:
   *      - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "ID da turma a ser deletada"
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Turma deletada com sucesso
   *       404:
   *         description: Turma não encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Turma não encontrada."
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
   *                   example: "Acesso autorizado"
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
   *         description: A turma está associada a professores ou estudantes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Turma está associada a professores ou estudantes. Remova essas associações para prosseguir com a exclusão da turma."
   */
  public async deleteClass(req: Request, res: Response): Promise<Response> {
    const classId: number = Number(req.params.id);

    await this.classService.deleteClass(classId);
    return res.status(204).send();
  }
}
