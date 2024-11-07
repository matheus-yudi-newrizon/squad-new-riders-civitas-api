import { Service } from 'typedi';
import { Class } from '../entities/Class';
import { School } from '../entities/School';
import { Student } from '../entities/Student';
import { CreateStudentDTO } from '../models/DTO/CreateStudentDTO';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { ClassRepository } from '../repositories/ClassRepository';
import { SchoolRepository } from '../repositories/SchoolRepository';
import { StudentRepository } from '../repositories/StudentRepository';

@Service()
export class StudentService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly schoolRepository: SchoolRepository,
    private readonly classRepository: ClassRepository
  ) {}

  /**
   * Verifica se a escola existe com base no ID.
   *
   * @param id - ID da escola.
   * @returns A instância da escola se encontrada, ou `undefined` caso contrário.
   */
  public async verifySchool(id: number): Promise<School | undefined> {
    const school: School = await this.schoolRepository.findByID(id);
    return school || undefined;
  }

  /**
   * Verifica se a turma existe com base no nome fornecido.
   *
   * @param className - Nome da turma.
   * @returns A instância da turma se encontrada, ou `undefined` caso contrário.
   */
  public async stringToClass(className: string): Promise<Class | undefined> {
    const studentClass: Class = await this.classRepository.findByName(className);
    return studentClass || undefined;
  }

  /**
   * Verifica se já existe um estudante com o documento ou número de matrícula fornecido.
   *
   * @param document - Documento do estudante.
   * @param registrationNumber - Número de matrícula do estudante.
   * @returns `true` se o estudante já existir, caso contrário `false`.
   */
  public async verifyStudentDuplicate(document: string, registrationNumber: string): Promise<boolean> {
    const duplicateStudent: Student = await this.studentRepository.findByDocumentOrRegistration(document, registrationNumber);
    return !!duplicateStudent;
  }

  /**
   * Cria um novo estudante e o salva no banco de dados.
   *
   * @param createStudentDTO - Dados do estudante a ser criado.
   * @param studentClass - Turma do estudante.
   * @param school - Escola do estudante.
   * @returns Um objeto contendo uma mensagem de sucesso.
   */
  public async create(createStudentDTO: CreateStudentDTO, studentClass: Class, school: School): Promise<ICreationSucessResponse> {
    const student: Student = this.studentRepository.createStudent({
      ...createStudentDTO,
      school,
      studentClass
    });

    await this.studentRepository.saveStudent(student);

    return {
      message: 'Estudante criado com sucesso'
    };
  }
}
