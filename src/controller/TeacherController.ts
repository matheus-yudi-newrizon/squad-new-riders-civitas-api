import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors/BadRequestError';
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
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTeacherDTO'
   *     responses:
   *       201:
   *         description: "Cadastro realizado com sucesso."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cadastro de professor realizado com sucesso."
   *       400:
   *         description: "Erro na requisição - dados faltando ou incorretos"
   *       409:
   *         description: "Conflito de cadastro"
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
}
