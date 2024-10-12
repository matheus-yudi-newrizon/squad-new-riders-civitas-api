import { Request, Response } from 'express';
import { createAdmin } from '../services/AdminService';

export class AdminController {
  /**
   * @swagger
   * /admin:
   *   post:
   *     summary: Cria um novo administrador
   *     description: Rota para criar um novo administrador no sistema. Recebe o e-mail no corpo da requisição e cria um administrador no banco de dados com uma senha gerada automaticamente.
   *     tags: [Admin]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 example: "admin@example.com"
   *     responses:
   *       201:
   *         description: Administrador criado com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Administrador criado com sucesso!"
   *                 password:
   *                   type: string
   *                   description: A senha gerada para o administrador.
   *                   example: "12345678"
   *       400:
   *         description: Erro na criação do administrador
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "E-mail é obrigatório"
   */
  async create(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'E-mail é obrigatório' });
      }

      const result = await createAdmin(email);

      return res.status(201).json({
        message: 'Administrador criado com sucesso!',
        password: result.rawPassword
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || 'Erro ao criar administrador' });
    }
  }
}
