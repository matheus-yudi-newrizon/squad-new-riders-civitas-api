import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Class } from '../entities/Class';
import { EducationType } from '../models/enums/EducationType';
import { SchoolShift } from '../models/enums/SchoolShift';
import { SchoolYear } from '../models/enums/SchoolYear';

@Repository()
export class ClassRepository {
  private repository: TypeORMRepository<Class> = MysqlDataSource.getRepository(Class);

  /**
   * Cria uma instância de uma turma com os dados fornecidos, mas não a salva no banco de dados.
   *
   * @param classData - Dados parciais da turma que será criada.
   * @returns Uma instância de `Class` criada, mas não persistida.
   */
  public createClass(classData: Partial<Class>): Class {
    return this.repository.create(classData);
  }

  /**
   * Salva uma instância de turma no banco de dados.
   *
   * @param classEntity - A instância da turma a ser salva.
   * @returns A instância de `Class` após ser salva no banco de dados.
   */
  public async saveClass(classEntity: Class): Promise<Class> {
    return await this.repository.save(classEntity);
  }

  /**
   * Verifica a existência de uma turma duplicada com base nos parâmetros fornecidos.
   *
   * @param name - Nome da turma.
   * @param schoolYear - Ano escolar da turma.
   * @param schoolShift - Turno escolar da turma.
   * @param educationType - Tipo de educação da turma.
   * @param schoolId - ID da escola associada à turma.
   * @returns Uma instância de `Class` se uma turma duplicada for encontrada, ou `undefined` caso contrário.
   */
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
   * Busca uma turma pelo nome fornecido.
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

  /**
   * Busca uma turma pelo Id fornecido.
   *
   * @param Id - Id da turma.
   * @returns Uma instância de `Class` se encontrada, ou `undefined` caso contrário.
   */
  public async findById(id: number): Promise<Class | undefined> {
    return await this.repository.findOne({
      where: { id },
      relations: ['school']
    });
  }
}
