import { Request, Response } from 'express';
import { Service as Controller } from 'typedi';
import validator from 'validator';
import { TeacherSchool, User } from '../entities';
import { BadRequestError, UnauthorizedError } from '../errors';
import { ILoginAdminRequest, ILoginResponse, ILoginTeacherRequest, IPayloadLogin } from '../models/interfaces';
import { AuthService } from '../services';

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

    const adminPayload: IPayloadLogin = this.authService.generatePayload(admin);
    const responseLoginDTO: ILoginResponse = await this.authService.generateAccessToken(adminPayload);

    return res.status(200).json(responseLoginDTO);
  }

  /**
   * @swagger
   * /teachers/login:
   *   post:
   *     summary: Login de professor
   *     description: "Este endpoint autentica o professor e fornece um token JWT."
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
   *             type: object
   *             required:
   *               - registrationNumber
   *             properties:
   *               registrationNumber:
   *                 type: string
   *                 description: Número de matrícula do professor
   *                 example: "123456"
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
   *         description: Número de matrícula inválido ou não preenchido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Número de matrícula inválido. Verifique e tente novamente."
   *       401:
   *         description: Matrícula não encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Matrícula não encontrada. Verifique seus dados e tente novamente."
   */
  public async teacherLogin(req: Request, res: Response): Promise<Response<ILoginResponse>> {
    const { registrationNumber } = req.body;
    const loginRequestDTO: ILoginTeacherRequest = { registrationNumber };

    if (!registrationNumber) throw new BadRequestError('Por favor, preencha os campos corretamente');

    const teacher: TeacherSchool = await this.authService.findRegistrationNumber(loginRequestDTO);
    if (!teacher) throw new UnauthorizedError('Matrícula não encontrada. Verifique seus dados e tente novamente');

    const teacherPayload: IPayloadLogin = this.authService.generatePayload(teacher);
    const responseLoginDTO: ILoginResponse = await this.authService.generateAccessToken(teacherPayload);

    return res.status(200).json(responseLoginDTO);
  }
}
