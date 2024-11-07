import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { School } from '../entities/School';

@Repository()
export class SchoolRepository {
  private repository: TypeORMRepository<School> = MysqlDataSource.getRepository(School);
  /**
   * Busca uma escola pelo ID fornecido.
   *
   * @param id - O ID da escola a ser buscada.
   * @returns Uma instância de `School` se encontrada, ou `undefined` caso contrário.
   */
  public async findByID(id: number): Promise<School | undefined> {
    return this.repository.findOne({ where: { id } });
  }
}
