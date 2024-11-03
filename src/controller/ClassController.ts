import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors/BadRequestError';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { ClassService } from '../services/ClassService';
import { CreateClassDTO } from '../models/DTO/CreateClassDTO';

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
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cadastro realizado com sucesso."
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
}
