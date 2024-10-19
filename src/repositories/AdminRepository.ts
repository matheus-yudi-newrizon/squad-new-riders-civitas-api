import bcrypt from 'bcryptjs';
import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { User } from '../entities/User';

@Repository()
export class AdminRepository {
  private repository: TypeORMRepository<User> = MysqlDataSource.getRepository(User);

  /**
   * Encontra um administrador pelo email.
   *
   * @param email - O email do administrador.
   * @returns Uma promessa que resolve com a instância de User ou undefined se não for encontrado.
   */
  public async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }

  /**
   * Valida a senha fornecida comparando com o hash salvo no banco de dados.
   *
   * @param admin - A instância do administrador.
   * @param password - A senha fornecida.
   * @returns Uma promessa que resolve com true (válida) ou false caso contrário.
   */
  public async validatePassword(admin: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, admin.password);
  }
}
