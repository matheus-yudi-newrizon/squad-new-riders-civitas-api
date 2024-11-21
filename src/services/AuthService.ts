import { ILoginResponse } from 'models/interfaces/ILoginResponse';
import { IPayloadLogin } from 'models/interfaces/IPayloadLogin';
import { Service } from 'typedi';
import { TeacherSchool } from '../entities/TeacherSchool';
import { User } from '../entities/User';
import { ILoginAdminRequest } from '../models/interfaces/ILoginAdminRequest';
import { ILoginTeacherRequest } from '../models/interfaces/ILoginTeacherRequest';
import { AdminRepository } from '../repositories/AdminRepository';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { JwtService } from './JwTService';

@Service()
export class AuthService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
    private readonly teacherRepository: TeacherRepository
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
   * Busca o número de matrícula de um professor.
   *
   * @param teacherDTO - Objeto contendo o número de matrícula do professor (`ILoginTeacherRequest`).
   * @returns A entidade `TeacherSchool` correspondente ao número de matrícula ou `undefined` caso não encontre.
   */
  public async findRegistrationNumber(teacherDTO: ILoginTeacherRequest): Promise<TeacherSchool | undefined> {
    const teacher: TeacherSchool = await this.teacherRepository.findByRegistrationNumber(teacherDTO.registrationNumber);
    return teacher || undefined;
  }

  /**
   * Gera o payload necessário para autenticação, com base na entidade fornecida.
   *
   * @param entity - Instância de `User` ou `TeacherSchool`.
   * @returns Um objeto `IPayloadLogin` com os dados necessários para o payload JWT.
   */
  public generatePayload(entity: User | TeacherSchool): IPayloadLogin {
    if (entity instanceof User)
      return { id: entity.id, email: entity.email, schoolId: entity.school.id, schoolName: entity.school.name, role: 'admin' };
    if (entity instanceof TeacherSchool)
      return { teacherId: entity.id, registrationNumber: entity.registrationNumber, schoolId: entity.school.id, role: 'teacher' };
  }

  /**
   * Gera um token JWT para autenticar o usuário.
   *
   * Este método deve ser chamado após a validação bem-sucedida da entidade,
   * e utiliza um payload restrito (definido em `IPayloadLogin`) para gerar o token.
   *
   * @param payload - Objeto `IPayloadLogin` contendo os atributos necessários
   *                  para o token JWT, incluindo `id`, `schoolId`, e opcionalmente
   *                  `email` ou `registrationNumber` dependendo do tipo de usuário.
   * @returns Um objeto `ILoginResponse` contendo uma mensagem de sucesso e o token JWT.
   */
  public async generateAccessToken(payload: IPayloadLogin): Promise<ILoginResponse> {
    const token: string = this.jwtService.generateToken(payload);
    return {
      message: 'Login bem-sucedido',
      token
    };
  }
}
