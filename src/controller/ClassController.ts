import { Request, Response } from 'express';
import { Class } from '../entities/Class';
import { MysqlDataSource } from '../config/database';

export class ClassController {
  /**
   * @swagger
   * /turmas/cadastro:
   *   post:
   *     summary: Cadastrar uma nova turma
   *     tags: [Turmas]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *               anoLetivo:
   *                 type: string
   *               periodoLetivo:
   *                 type: string
   *               ensino:
   *                 type: string
   *     responses:
   *       200:
   *         description: Cadastro realizado com sucesso
   *       400:
   *         description: Erro de validação
   *       500:
   *         description: Erro interno no servidor
   */

  /**
   * Cadastra uma nova turma no banco de dados.
   *
   * @param req - Objeto da requisição contendo o corpo com os dados da turma.
   * @param res - Objeto da resposta para retornar o status do cadastro.
   * @returns Um objeto JSON com a mensagem de sucesso ou erro.
   *
   * Valida os campos 'nome', 'anoLetivo', 'periodoLetivo' e 'ensino'. Caso algum
   * dos campos esteja ausente, retorna um erro 400. Em caso de erro no banco,
   * retorna um erro 500.
   *
   * Exemplo de corpo de requisição esperado:
   * ```json
   * {
   *   "nome": "Turma A",
   *   "anoLetivo": "1st year",
   *   "periodoLetivo": "Morning",
   *   "ensino": "Nursery"
   * }
   * ```
   */
  async cadastrarTurma(req: Request, res: Response): Promise<Response> {
    const { nome, anoLetivo, periodoLetivo, ensino } = req.body;

    if (!nome || !anoLetivo || !periodoLetivo || !ensino) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const classRepository = MysqlDataSource.getRepository(Class);

    try {
      const newClass = classRepository.create({ nome, anoLetivo, periodoLetivo, ensino });
      await classRepository.save(newClass);

      return res.status(200).json({ message: 'Cadastro realizado com sucesso.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao cadastrar a turma.' });
    }
  }
}
