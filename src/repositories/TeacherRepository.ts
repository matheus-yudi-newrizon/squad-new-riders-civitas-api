import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Teacher, TeacherClass, TeacherSchool } from '../entities';

@Repository()
export class TeacherRepository {
  private repository: TypeORMRepository<Teacher> = MysqlDataSource.getRepository(Teacher);
  private teacherSchoolRepository: TypeORMRepository<TeacherSchool> = MysqlDataSource.getRepository(TeacherSchool);
  private teacherClassRepository: TypeORMRepository<TeacherClass> = MysqlDataSource.getRepository(TeacherClass);

  /**
   * Busca um professor pelo ID fornecido.
   *
   * @param teacherId - ID do professor a ser buscado.
   * @returns Uma instância de `Teacher` se encontrada, ou `undefined` caso contrário.
   */
  public async findById(teacherId: number): Promise<Teacher | undefined> {
    return await this.repository.findOne({ where: { id: teacherId }, relations: ['teacherClasses.class', 'teacherSchools'] });
  }

  /**
   * Cria uma instância de professor com os dados fornecidos, mas não a salva no banco de dados.
   *
   * @param teacherData - Dados parciais do professor que será criado.
   * @returns Uma instância de `Teacher` criada, mas não persistida.
   */
  public createTeacher(teacherData: Partial<Teacher>): Teacher {
    return this.repository.create(teacherData);
  }

  /**
   * Salva um professor no banco de dados.
   *
   * @param teacher - A instância do professor a ser salva.
   * @returns A instância de `Teacher` após ser salva no banco de dados.
   */
  public async saveTeacher(teacher: Teacher): Promise<Teacher> {
    return await this.repository.save(teacher);
  }

  /**
   * Cria uma associação entre o professor e a escola na tabela `TeacherSchool`.
   *
   * @param teacherSchoolData - Dados parciais da associação `TeacherSchool` que será criada.
   * @returns Uma instância de `TeacherSchool` criada, mas não persistida.
   */
  public createTeacherSchool(teacherSchoolData: Partial<TeacherSchool>): TeacherSchool {
    return this.teacherSchoolRepository.create(teacherSchoolData);
  }

  /**
   * Salva uma associação entre o professor e a escola no banco de dados.
   *
   * @param teacherSchool - A instância `TeacherSchool` a ser salva.
   * @returns A instância de `TeacherSchool` após ser salva no banco de dados.
   */
  public async saveTeacherSchool(teacherSchool: TeacherSchool): Promise<TeacherSchool> {
    return await this.teacherSchoolRepository.save(teacherSchool);
  }

  /**
   * Busca um professor pelo CPF fornecido.
   *
   * @param cpf - O CPF do professor.
   * @returns Uma instância de `Teacher` se encontrada, ou `undefined` caso contrário.
   */
  public async findByCpf(cpf: string): Promise<Teacher | undefined> {
    return await this.repository.findOne({ where: { cpf } });
  }

  /**
   * Busca uma associação `TeacherSchool` com base no número de matrícula e no ID da escola.
   * Verifica se o número de matrícula já existe para o professor na escola.
   *
   * @param registrationNumber - O número de matrícula do professor.
   * @param schoolId - O ID da escola.
   * @returns Uma instância de `TeacherSchool` se encontrada, ou `undefined` caso contrário.
   */
  public async findTeacherSchoolByRegistrationAndSchool(registrationNumber: string, schoolId: number): Promise<TeacherSchool | undefined> {
    return await this.teacherSchoolRepository.findOne({
      where: {
        registrationNumber,
        school: { id: schoolId }
      }
    });
  }

  /**
   * Busca uma associação `TeacherSchool` com base no ID do professor e no ID da escola.
   *
   * @param teacherId - O ID do professor.
   * @param schoolId - O ID da escola.
   * @returns Uma instância de `TeacherSchool` se encontrada, ou `undefined` caso contrário.
   */
  public async findTeacherSchoolByTeacherAndSchool(teacherId: number, schoolId: number): Promise<TeacherSchool | undefined> {
    return await this.teacherSchoolRepository.findOne({
      where: {
        teacher: { id: teacherId },
        school: { id: schoolId }
      }
    });
  }

  /**
   * Remove uma associação `TeacherSchool` do repositório.
   *
   * @param teacherSchool - A associação `TeacherSchool` a ser removida.
   * @returns Uma promessa que é resolvida quando a remoção é concluída.
   */
  public async removeTeacherSchool(teacherSchool: TeacherSchool): Promise<void> {
    await this.teacherSchoolRepository.remove(teacherSchool);
  }

  /**
   * Remove todas as associações de turmas de um professor com base no ID do professor.
   *
   * @param teacherId - O ID do professor cujas associações de turmas serão removidas.
   * @returns Uma promessa que é resolvida quando as associações são removidas.
   */
  public async removeTeacherClassesByTeacherId(teacherId: number): Promise<void> {
    await this.teacherClassRepository.delete({ teacher: { id: teacherId } });
  }

  /**
   * Remove um professor do repositório com base no seu ID.
   *
   * @param teacherId - O ID do professor a ser removido.
   * @returns Uma promessa que é resolvida quando a remoção é concluída.
   */
  public async removeTeacher(teacherId: number): Promise<void> {
    await this.repository.delete({ id: teacherId });
  }

  /**
   * Cria uma associação entre o professor e a turma na tabela `TeacherClass`.
   *
   * @param teacherClassData - Dados parciais da associação `TeacherClass` que será criada.
   * @returns Uma instância de `TeacherClass` criada, mas não persistida.
   */
  public createTeacherClass(teacherClassData: Partial<TeacherClass>): TeacherClass {
    return this.teacherClassRepository.create(teacherClassData);
  }

  /**
   * Salva múltiplas associações entre o professor e as turmas no banco de dados.
   *
   * @param teacherClasses - Lista de instâncias de `TeacherClass` a serem salvas.
   * @returns A lista de instâncias `TeacherClass` após serem salvas no banco de dados.
   */
  public async saveTeacherClasses(teacherClasses: TeacherClass[]): Promise<TeacherClass[]> {
    return await this.teacherClassRepository.save(teacherClasses);
  }

  /**
   * Busca um professor pelo seu número de registro, incluindo o relacionamento com a escola.
   *
   * @param registrationNumber - O número de registro do professor.
   * @returns Uma instância de `TeacherSchool` com o relacionamento `School` carregado, se encontrada, ou `undefined` caso contrário.
   */
  public async findByRegistrationNumber(registrationNumber: string): Promise<TeacherSchool | undefined> {
    return await this.teacherSchoolRepository.findOne({ where: { registrationNumber }, relations: ['school', 'teacher'] });
  }

  /**
   * Busca todos os professores associados a uma escola específica.
   *
   * @param schoolId - ID da escola.
   * @returns Uma lista de instâncias de `Teacher` associadas à escola em ordem alfabética.
   */
  public async findTeachersBySchoolId(schoolId: number): Promise<Teacher[]> {
    return await this.repository
      .createQueryBuilder('teacher')
      .innerJoin('teacher.teacherSchools', 'teacherSchool', 'teacherSchool.schoolId = :schoolId', { schoolId })
      .orderBy('teacher.fullName', 'ASC')
      .getMany();
  }

  /**
   * Busca todos os professores associados a uma escola específica, incluindo as turmas de cada professor
   * e a associação `TeacherSchool`, que contém o número de matrícula (`registrationNumber`).
   *
   * @param schoolId - ID da escola.
   * @returns Uma lista de instâncias de `Teacher` associadas à escola, com suas turmas e números de matrícula em ordem alfabética.
   */
  public async findTeachersBySchoolIdWithClasses(schoolId: number): Promise<Teacher[]> {
    return await this.repository
      .createQueryBuilder('teacher')
      .innerJoin('teacher.teacherSchools', 'teacherSchool', 'teacherSchool.schoolId = :schoolId', { schoolId })
      .leftJoinAndSelect('teacher.teacherClasses', 'teacherClass')
      .leftJoinAndSelect('teacherClass.class', 'class')
      .leftJoinAndSelect('teacher.teacherSchools', 'teacherSchoolRelation')
      .orderBy('teacher.fullName', 'ASC')
      .getMany();
  }
}
