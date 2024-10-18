import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import validator from 'validator';
import { ILoginAdminRequest } from '../interfaces/ILoginAdminRequest';
import { ILoginAdminResponse } from '../interfaces/ILoginAdminResponse';
import { AdminService } from '../services/AdminService';
import { BadRequestError } from '../utils/apiErrors';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  /**
   * @swagger
   * /admin/login:
   *   post:
   *     summary: Login de administrador
   *     tags: [Admin]
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
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email do administrador
   *                 example: "email@example.com"
   *               password:
   *                 type: string
   *                 description: Senha do administrador
   *                 example: "sua_senha"
   *     responses:
   *       200:
   *         description: Login bem-sucedido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Login bem-sucedido"
   *                 token:
   *                   type: string
   *                   example: "seu_jwt_token"
   *       400:
   *         description: Campos obrigatórios não preenchidos ou email inválido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Por favor, preencha todos os campos obrigatórios."
   */
  /**
   * Método de login de administrador.
   *
   * @param req - A requisição contendo o email e a senha.
   * @param res - A resposta HTTP a ser enviada de volta.
   * @returns Retorna uma mensagem de sucesso e um token se o login for bem-sucedido.
   */
  public async login(req: Request, res: Response): Promise<Response<ILoginAdminResponse>> {
    const { email, password } = req.body;
    const loginRequestDTO: ILoginAdminRequest = { email, password };

    if (!email || !password) {
      throw new BadRequestError('Por favor, preencha os campos corretamente');
    }

    if (!validator.isEmail(email)) {
      throw new BadRequestError('Por favor, preencha os campos corretamente');
    }

    const responseLoginDTO: ILoginAdminResponse = await this.adminService.login(loginRequestDTO);

    return res.status(200).json(responseLoginDTO);
  }
}
