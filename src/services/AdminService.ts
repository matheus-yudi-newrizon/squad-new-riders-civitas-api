import { User } from 'entities/User';
import { ILoginAdminResponse } from 'interfaces/ILoginAdminResponse';
import { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import { ILoginAdminRequest } from '../interfaces/ILoginAdminRequest';
import { AdminRepository } from '../repositories/AdminRepository';
import { JwtService } from '../services/JwtService';
import { UnauthorizedError } from '../utils/apiErrors';

@Service()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Realiza o login do administrador, verificando email e senha.
   *
   * @param adminDTO - Dados de login (email e senha) como ILoginAdminRequest.
   * @returns Uma promessa que se resolve com uma mensagem de sucesso ou lança um erro.
   */
  public async login(adminDTO: ILoginAdminRequest): Promise<ILoginAdminResponse> {
    const admin: User = await this.adminRepository.findByEmail(adminDTO.email);

    if (!admin) {
      throw new UnauthorizedError('Seu e-mail ou senha estão incorretos');
    }

    const validPassword: boolean = await this.adminRepository.validatePassword(admin, adminDTO.password);

    if (!validPassword) {
      throw new UnauthorizedError('Seu e-mail ou senha estão incorretos');
    }

    const sessionId: string = uuidv4();
    const token: string = this.jwtService.generateToken({
      id: admin.id,
      email: admin.email,
      iat: Math.floor(Date.now() / 1000),
      sessionId: sessionId
    });

    return {
      message: 'Login bem-sucedido',
      token: token
    };
  }
}
