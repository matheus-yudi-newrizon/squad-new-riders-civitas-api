import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import { BadRequestError } from '../errors';
import { CreateEvaluationDTO, IEvaluationData, ISuccessResponse } from '../models';
import { EvaluationService } from '../services';

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
   *                 label:
   *                    type: string
   *                    example: "PDI23_11_2024_10h15"
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
  public async create(req: Request, res: Response): Promise<Response<ISuccessResponse>> {
    const teacherId: number | undefined = res.locals.teacherId;
    const createEvaluationDTO: CreateEvaluationDTO = req.body;

    if (!createEvaluationDTO.studentId) {
      throw new BadRequestError('ID do estudante é obrigatório.');
    }
    if (!teacherId) {
      throw new BadRequestError('Token inválido ou professor não identificado.');
    }

    const result: ISuccessResponse = await this.evaluationService.createEvaluation(createEvaluationDTO, teacherId);

    return res.status(201).json(result);
  }

  /**
   * @swagger
   * /students/evaluations/{evaluationId}/show:
   *   get:
   *     summary: Obtém os detalhes de uma avaliação específica
   *     description: "Este endpoint retorna os detalhes de uma avaliação específica associada ao estudante avaliado. Requer um token JWT no cabeçalho Authorization no formato 'Bearer {token}'."
   *     tags: [Evaluations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: evaluationId
   *         description: ID da avaliação para buscar os detalhes
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Detalhes da avaliação encontrados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 date:
   *                   type: string
   *                   format: date
   *                   example: "22/11/24"
   *                 label:
   *                   type: string
   *                   example: "PDI22_11_2024_10h15"
   *                 student:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 101
   *                     fullName:
   *                       type: string
   *                       example: "João da Silva"
   *                     studentClass:
   *                       type: string
   *                       example: "Turma A"
   *                 reviews:
   *                   type: object
   *                   properties:
   *                     selfAwareness:
   *                       type: integer
   *                       example: 4
   *                     empathy:
   *                       type: integer
   *                       example: 5
   *                     communication:
   *                       type: integer
   *                       example: 3
   *                     teamwork:
   *                       type: integer
   *                       example: 4
   *                     autonomy:
   *                       type: integer
   *                       example: 3
   *                 teacherComments:
   *                   type: string
   *                   example: "Excelente progresso, mas precisa melhorar na comunicação."
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
   *       403:
   *         description: Você não tem permissão para acessar este recurso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Você não tem permissão para acessar este recurso."
   *       404:
   *         description: Avaliação não encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Avaliação não encontrada."
   */
  public async getEvaluation(req: Request, res: Response): Promise<Response<IEvaluationData>> {
    const { evaluationId } = req.params;
    const evaluationNumber: number = Number(evaluationId);
    const evaluation: IEvaluationData = await this.evaluationService.showEvaluation(evaluationNumber);

    return res.status(200).json(evaluation);
  }
}
