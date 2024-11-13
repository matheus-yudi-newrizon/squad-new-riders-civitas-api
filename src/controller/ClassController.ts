import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { CreateClassDTO } from '../models/DTO/CreateClassDTO';
import { UpdateClassDTO } from '../models/DTO/UpdateClassDTO';
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

  public async updateClass(req: Request, res: Response): Promise<Response> {
    const classId: number = Number(req.params.id);
    const updateClassDTO: UpdateClassDTO = req.body;

    const result = await this.classService.updateClass(classId, updateClassDTO);
    return res.status(200).json(result);
  }
}
