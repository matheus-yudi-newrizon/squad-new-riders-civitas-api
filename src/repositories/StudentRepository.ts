import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Student } from '../entities';
import { NotFoundError } from '../errors';

@Repository()
export class StudentRepository {
  private repository: TypeORMRepository<Student> = MysqlDataSource.getRepository(Student);
  /**
   * Cria uma instância de estudante com os dados fornecidos, mas não a salva no banco de dados.
   *
   * @param studentData - Dados parciais do estudante que será criado.
   * @returns Uma instância de `Student` criada, mas não persistida.
   */
  public createStudent(studentData: Partial<Student>): Student {
    return this.repository.create(studentData);
  }

  /**
   * Salva um estudante no banco de dados.
   *
   * @param student - A instância do estudante a ser salva.
   * @returns A instância de `Student` após ser salva no banco de dados.
   */
  public async saveStudent(student: Student): Promise<Student> {
    return await this.repository.save(student);
  }

  /**
   * Deleta um estudante do banco de dados.
   *
   * @param student - A instância do estudante a ser deletada.
   */
  public async deleteStudent(student: Student): Promise<void> {
    await this.repository.remove(student);
  }

  /**
   * Busca um estudante pelo documento.
   *
   * @param document - O documento (CPF ou equivalente) do estudante.
   * @returns Uma instância de `Student` se encontrada, ou `undefined` caso contrário.
   */
  public async findByDocument(document: string): Promise<Student | undefined> {
    return await this.repository.findOne({ where: { document } });
  }

  /**
   * Busca um estudante pelo número de matrícula.
   *
   * @param registrationNumber - O número de matrícula do estudante.
   * @throws NotFoundError se o estudante não for encontrado.
   * @returns Uma instância de `Student` se encontrada, ou `undefined` caso contrário.
   */
  public async findByRegistrationNumber(registrationNumber: string): Promise<Student | undefined> {
    const student = await this.repository.findOne({ where: { registrationNumber }, relations: ['school'] });
    if (!student) throw new NotFoundError('Estudante não encontrado');
    return student;
  }

  /**
   * Busca um estudante pelo ID.
   *
   * @param id - O identificador único do estudante.
   * @returns Uma instância de `Student` se encontrada, ou `undefined` caso contrário.
   * Inclui as relações com a classe do estudante (`studentClass`).
   */
  public async findById(id: number): Promise<Student | undefined> {
    const student: Student = await this.repository.findOne({ where: { id }, relations: ['studentClass'] });
    if (!student) throw new NotFoundError('Estudante não encontrado');
    return student;
  }

  /**
   * Recupera uma lista de estudantes para uma determinada escola.
   *
   * @param schoolId - O ID da escola para recuperar os estudantes.
   * @param fullName - (Opcional) O nome completo do estudante para filtrar.
   * @returns Uma promessa que resolve para um array de estudantes em ordem alfabética.
   */
  public async listStudents(schoolId: number, fullName?: string): Promise<Student[]> {
    const query = this.repository
      .createQueryBuilder('student')
      .innerJoin('student.studentClass', 'class')
      .innerJoin('class.school', 'school')
      .where('school.id = :schoolId', { schoolId })
      .select(['student', 'class.name'])
      .orderBy('student.fullName', 'ASC');

    if (fullName) {
      query.andWhere('student.fullName LIKE :fullName COLLATE utf8mb4_general_ci', { fullName: `%${fullName}%` });
    }

    return query.getMany();
  }

  /**
   * Busca todos os estudantes de uma determinada turma.
   *
   * @param classId - O ID da turma.
   * @param schoolId - O ID da escola.
   * @param fullName - O nome completo do estudante (opcional).
   * @returns Um array contendo todos os estudantes da turma especificada em ordem alfabética.
   */
  public async listStudentsByClass(classId: number, schoolId: number, fullName?: string): Promise<Student[]> {
    const query = this.repository
      .createQueryBuilder('student')
      .innerJoin('student.studentClass', 'class')
      .where('class.id = :classId', { classId })
      .andWhere('class.schoolId = :schoolId', { schoolId })
      .select(['student'])
      .orderBy('student.fullName', 'ASC');

    if (fullName) {
      query.andWhere('student.fullName LIKE :fullName COLLATE utf8mb4_general_ci', { fullName: `%${fullName}%` });
    }

    return query.getMany();
  }
}
