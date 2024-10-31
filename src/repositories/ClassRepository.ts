import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Class } from '../entities/Class';

@Repository()
export class ClassRepository {
  private repository: TypeORMRepository<Class> = MysqlDataSource.getRepository(Class);

  /**
   * Verifica se uma turma existe pelo nome.
   *
   * @param className - O nome da turma.
   * @returns Uma promessa que resolve com true se a turma existe ou false caso contrário.
   */
  public async findByName(name: string): Promise<Class | null> {
    return await this.repository.findOne({ where: { name } });
  }
}
