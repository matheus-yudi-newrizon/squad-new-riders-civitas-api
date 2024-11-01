import { User } from 'entities/User';
import { ILoginResponse } from 'models/interfaces/ILoginResponse';
import { Service } from 'typedi';
import { ILoginAdminRequest } from '../models/interfaces/ILoginAdminRequest';
import { AdminRepository } from '../repositories/AdminRepository';
import { JwtService } from './JwtService';

@Service()
export class AuthService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Busca um administrador pelo email fornecido.
   *
   * @param adminDTO - Objeto contendo o email e senha para autenticação.
   * @returns Uma promessa que se resolve com o objeto `User` do administrador, caso o email exista,
   * ou `undefined` se o administrador não for encontrado.
   */
  public async findAdminEmail(adminDTO: ILoginAdminRequest): Promise<User | undefined> {
    const admin: User = await this.adminRepository.findByEmail(adminDTO.email);
    return admin || undefined;
  }
  /**
   * Valida a senha do administrador comparando com o hash armazenado.
   *
   * @param adminDTO - Objeto contendo os dados de login, incluindo a senha a ser verificada.
   * @param admin - O objeto `User` do administrador recuperado do banco de dados.
   * @returns Uma promessa que se resolve com `true` se a senha estiver correta ou `false` caso contrário.
   */
  public async validatePassword(adminDTO: ILoginAdminRequest, admin: User): Promise<boolean> {
    const adminPasswordCompare: boolean = await this.adminRepository.validatePassword(admin, adminDTO.password);
    return !!adminPasswordCompare;
  }

  /**
   * Gera um token JWT para autenticar o administrador.
   *
   * Este método deve ser chamado após o administrador ter sido validado com sucesso.
   *
   * @param admin - Instância do administrador autenticado (`User`).
   * @returns Um objeto contendo uma mensagem de sucesso e o token JWT (`ILoginResponse`).
   */
  public async generateAccessToken(admin: User): Promise<ILoginResponse> {
    const token: string = this.jwtService.generateToken({
      id: admin.id,
      email: admin.email,
      schoolId: admin.school.id
    });
    return {
      message: 'Login bem-sucedido',
      token
    };
  }
}
