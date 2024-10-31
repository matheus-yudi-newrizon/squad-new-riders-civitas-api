import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Student } from '../entities/Student';

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
   * Busca um estudante pelo documento ou número de matrícula fornecidos.
   *
   * @param document - O documento do estudante (ex.: RG ou CPF).
   * @param registrationNumber - O número de matrícula do estudante.
   * @returns Uma instância de `Student` se encontrada, ou `undefined` caso contrário.
   */
  public async findByDocumentOrRegistration(document: string, registrationNumber: string): Promise<Student | undefined> {
    return await this.repository.findOne({
      where: [{ document }, { registrationNumber }]
    });
  }
}
