import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import validator from 'validator';
import { User } from '../entities/User';
import { BadRequestError } from '../errors/BadRequestError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ILoginAdminRequest } from '../models/interfaces/ILoginAdminRequest';
import { ILoginResponse } from '../models/interfaces/ILoginResponse';
import { AuthService } from '../services/AuthService';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * @swagger
   * /admin/login:
   *   post:
   *     summary: Login de administrador
   *     description: "Este endpoint autentica o administrador e fornece um token JWT."
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
   *             required:
   *               - email
   *               - password
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
   *                   example: "Por favor, preencha os campos obrigatórios corretamente"
   *       401:
   *         description: Credenciais incorretas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Seu e-mail ou senha estão incorretos"
   */
  public async adminLogin(req: Request, res: Response): Promise<Response<ILoginResponse>> {
    const { email, password } = req.body;
    const loginRequestDTO: ILoginAdminRequest = { email, password };

    if (!email || !password || !validator.isEmail(email)) throw new BadRequestError('Por favor, preencha os campos corretamente');

    const admin: User = await this.authService.findAdminEmail(loginRequestDTO);
    if (!admin) throw new UnauthorizedError('Seu e-mail ou senha estão incorretos');

    const matchPassword: boolean = await this.authService.validatePassword(loginRequestDTO, admin);
    if (!matchPassword) throw new UnauthorizedError('Seu e-mail ou senha estão incorretos');

    const responseLoginDTO: ILoginResponse = await this.authService.generateAccessToken(admin);

    return res.status(200).json(responseLoginDTO);
  }
}
