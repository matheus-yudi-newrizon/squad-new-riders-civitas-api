import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors/BadRequestError';
import { CreateEvaluationDTO } from '../models/DTO/CreateEvaluationDTO';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { EvaluationService } from '../services/EvaluationService';

@Controller()
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  /**
   * @swagger
   * /teachers/me/evaluations:
   *   post:
   *     summary: Cadastra uma nova avaliação de desempenho individual (ADI)
   *     description: "Este endpoint cadastra uma nova avaliação de um estudante, vinculada ao professor autenticado. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Evaluations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEvaluationDTO'
   *     responses:
   *       201:
   *         description: Avaliação criada com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Avaliação criada com sucesso."
   *       400:
   *         description: Dados faltando ou incorretos.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "ID do estudante é obrigatório."
   *       401:
   *         description: Acesso não autorizado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Token não consta na requisição."
   *       404:
   *         description: Estudante ou professor não encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Estudante não encontrado."
   */
  public async create(req: Request, res: Response): Promise<Response<ICreationSucessResponse>> {
    const teacherId: number | undefined = res.locals.teacherId;
    const createEvaluationDTO: CreateEvaluationDTO = req.body;

    if (!createEvaluationDTO.studentId) {
      throw new BadRequestError('ID do estudante é obrigatório.');
    }
    if (!teacherId) {
      throw new BadRequestError('Token inválido ou professor não identificado.');
    }

    const result: ICreationSucessResponse = await this.evaluationService.createEvaluation(createEvaluationDTO, teacherId);

    return res.status(201).json(result);
  }
}
