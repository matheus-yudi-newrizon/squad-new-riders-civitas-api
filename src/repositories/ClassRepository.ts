import { Service as Repository } from 'typedi';
import { In, Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Class } from '../entities';
import { EducationType, SchoolShift, SchoolYear } from '../models';

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
   * Exclui a entidade de turma especificada do repositório.
   *
   * @param classEntity - A entidade de turma a ser excluída.
   * @returns Uma promessa que é resolvida quando a entidade de turma for removida.
   */
  public async deleteClass(classEntity: Class): Promise<void> {
    await this.repository.remove(classEntity);
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
   * Busca múltiplas turmas com base em um array de IDs fornecido.
   *
   * @param ids - Array de IDs das turmas.
   * @returns Uma lista de instâncias de `Class` correspondentes aos IDs fornecidos.
   */
  public async findByIds(ids: number[]): Promise<Class[]> {
    return await this.repository.find({
      where: { id: In(ids) }
    });
  }

  /**
   * Busca uma turma específica com base no ID fornecido.
   *
   * @param id - ID da turma a ser buscada.
   * @returns Uma instância de `Class` se encontrada, ou `undefined` caso contrário.
   */
  public async findById(id: number): Promise<Class | undefined> {
    return await this.repository.findOne({
      where: { id },
      relations: ['school', 'students', 'teacherClasses']
    });
  }

  /**
   * Busca todas as turmas associadas a um professor específico com base no ID do professor.
   *
   * @param teacherId - ID do professor.
   * @returns Uma lista de instâncias de `Class` associadas ao professor em ordem alfabética.
   */
  public async findByTeacherId(teacherId: number): Promise<Class[]> {
    return await this.repository
      .createQueryBuilder('class')
      .innerJoin('class.teacherClasses', 'teacherClass')
      .where('teacherClass.teacherId = :teacherId', { teacherId })
      .leftJoinAndSelect('class.school', 'school')
      .orderBy('class.name', 'ASC')
      .getMany();
  }

  /**
   * Busca turmas com base nos filtros opcionais fornecidos.
   *
   * @param filters - Filtros opcionais para listar as turmas, incluindo ano, turno, tipo de educação e escola.
   * @returns Uma lista de instâncias de `Class` que atendem aos critérios fornecidos.
   */
  public async findClassesWithFilters(filters: {
    schoolYear?: string;
    educationType?: string;
    schoolShift?: string;
    schoolId: number;
  }): Promise<Class[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.school', 'school')
      .where('school.id = :schoolId', { schoolId: filters.schoolId })
      .orderBy('class.name', 'ASC');

    if (filters.schoolYear) {
      queryBuilder.andWhere('class.schoolYear = :schoolYear', { schoolYear: filters.schoolYear });
    }

    if (filters.educationType) {
      queryBuilder.andWhere('class.educationType = :educationType', { educationType: filters.educationType });
    }

    if (filters.schoolShift) {
      queryBuilder.andWhere('class.schoolShift = :schoolShift', { schoolShift: filters.schoolShift });
    }

    return await queryBuilder.getMany();
  }
}
