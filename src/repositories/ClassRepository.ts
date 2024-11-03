import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Class } from '../entities/Class';
import { SchoolYear } from '../models/enums/SchoolYear';
import { SchoolShift } from '../models/enums/SchoolShift';
import { EducationType } from '../models/enums/EducationType';

@Repository()
export class ClassRepository {
  private repository: TypeORMRepository<Class> = MysqlDataSource.getRepository(Class);

  public createClass(classData: Partial<Class>): Class {
    return this.repository.create(classData);
  }

  public async saveClass(classEntity: Class): Promise<Class> {
    return await this.repository.save(classEntity);
  }

  public async findDuplicateClass(
    name: string,
    schoolYear: SchoolYear,
    schoolShift: SchoolShift,
    educationType: EducationType,
    schoolId: number
  ): Promise<Class | undefined> {
    return await this.repository.findOne({
      where: {
        name,
        schoolYear,
        schoolShift,
        educationType,
        school: { id: schoolId }
      }
    });
  }

  /**
   * Busca uma turma pelo nome.
   *
   * @param name - Nome da turma.
   * @returns Uma instância de `Class` se encontrada, ou `undefined` caso contrário.
   */
  public async findByName(name: string): Promise<Class | undefined> {
    return await this.repository.findOne({
      where: { name },
      relations: ['school']
    });
  }
}
