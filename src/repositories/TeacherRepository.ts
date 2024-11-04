import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Teacher } from '../entities/Teacher';
import { TeacherSchool } from '../entities/TeacherSchool';

@Repository()
export class TeacherRepository {
  private repository: TypeORMRepository<Teacher> = MysqlDataSource.getRepository(Teacher);
  private teacherSchoolRepository: TypeORMRepository<TeacherSchool> = MysqlDataSource.getRepository(TeacherSchool);

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
}
