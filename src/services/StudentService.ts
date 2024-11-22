import { Service } from 'typedi';
import { Class, School, Student } from '../entities';
import { ConflictError, NotFoundError } from '../errors';
import { CreateStudentDTO, UpdateStudentDTO } from '../models/DTO';
import { ICreationSucessResponse, IUpdateResponse } from '../models/interfaces';
import { ClassRepository, SchoolRepository, StudentRepository } from '../repositories';

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
   * Verifica se a turma existe com base no Id fornecido.
   *
   * @param classId - Id da turma.
   * @returns A instância da turma se encontrada, ou `undefined` caso contrário.
   */
  public async stringToClass(classId: string): Promise<Class | undefined> {
    const convertedId: number = Number(classId);
    const studentClass: Class = await this.classRepository.findById(convertedId);
    return studentClass || undefined;
  }

  /**
   * Verifica se já existe um estudante com o documento ou número de matrícula fornecido.
   *
   * @param document - Documento do estudante.
   * @param registrationNumber - Número de matrícula do estudante.
   * @param excludeId - ID do estudante a ser excluído da verificação.
   * @returns Uma promessa que resolve se não houver estudante duplicado, ou rejeita com um erro de conflito caso contrário.
   */
  public async verifyStudentDuplicate(document?: string, registrationNumber?: string, excludeId?: number): Promise<void> {
    const studentByDocument = document ? await this.verifyStudentDocument(document) : null;
    const studentByRegistration = registrationNumber ? await this.verifyStudentRegistrationNumber(registrationNumber) : null;
    if ((studentByDocument && studentByDocument.id !== excludeId) || (studentByRegistration && studentByRegistration.id !== excludeId))
      throw new ConflictError('Estudante já cadastrado.');
  }

  /**
   * Verifica a existência de um estudante pelo documento.
   *
   * @param document - O documento (CPF ou equivalente) do estudante.
   * @returns Uma instância de `Student` se encontrada, ou `undefined` caso contrário.
   */
  private async verifyStudentDocument(document: string): Promise<Student | undefined> {
    const student: Student = await this.studentRepository.findByDocument(document.replace(/\D/g, ''));
    return student || undefined;
  }

  /**
   * Verifica a existência de um estudante pelo número de matrícula.
   *
   * @param registrationNumber - O número de matrícula do estudante.
   * @returns Uma instância de `Student` se encontrada, ou `undefined` caso contrário.
   */
  private async verifyStudentRegistrationNumber(registrationNumber: string): Promise<Student | undefined> {
    const student: Student = await this.studentRepository.findByRegistrationNumber(registrationNumber);
    return student || undefined;
  }

  /**
   * Verifica a existência de um estudante pelo ID.
   *
   * @param id - O identificador único do estudante.
   * @throws {NotFoundError} Se o estudante não for encontrado.
   * @returns Uma instância de `Student` se encontrada.
   */
  private async verifyStudentId(id: number): Promise<Student> {
    const student: Student = await this.studentRepository.findById(id);
    if (!student) throw new NotFoundError('Estudante não encontrado');
    return student;
  }

  /**
   * Valida e prepara os dados para a atualização de um estudante.
   *
   * @param id - O identificador único do estudante.
   * @param updateStudentDTO - Os dados enviados para atualização do estudante.
   * @param student - Os dados atuais do estudante.
   * @throws {ConflictError} Se for detectada duplicidade de documento ou número de matrícula.
   * @returns Um objeto parcial contendo os dados atualizados do estudante.
   */
  private async validateStudentUpdate(id: number, updateStudentDTO: UpdateStudentDTO, student: Student): Promise<Partial<Student>> {
    const updatedData: Partial<Student> = {};
    if (updateStudentDTO.fullName && updateStudentDTO.fullName !== student.fullName) {
      updatedData.fullName = updateStudentDTO.fullName;
    }
    if (updateStudentDTO.cpfGuardian && updateStudentDTO.cpfGuardian !== student.cpfGuardian) {
      updatedData.cpfGuardian = updateStudentDTO.cpfGuardian;
    }
    if (updateStudentDTO.document && updateStudentDTO.document !== student.document) {
      await this.verifyStudentDuplicate(updateStudentDTO.document, undefined, id);
      updatedData.document = updateStudentDTO.document;
    }
    if (updateStudentDTO.registrationNumber && updateStudentDTO.registrationNumber !== student.registrationNumber) {
      await this.verifyStudentDuplicate(undefined, updateStudentDTO.registrationNumber, id);
      updatedData.registrationNumber = updateStudentDTO.registrationNumber;
    }
    if (updateStudentDTO.studentClass && updateStudentDTO.studentClass !== student.studentClass.id.toString()) {
      const studentClass: Class = await this.stringToClass(updateStudentDTO.studentClass);
      updatedData.studentClass = studentClass;
    }
    return updatedData;
  }

  /**
   * Atualiza os dados de um estudante no banco de dados.
   *
   * @param id - O identificador único do estudante a ser atualizado.
   * @param updateStudentDTO - Os dados enviados para atualização do estudante.
   * @throws {NotFoundError} Se o estudante não for encontrado.
   * @throws {ConflictError} Se for detectada duplicidade de documento ou número de matrícula.
   * @returns Um objeto contendo uma mensagem de sucesso.
   */
  public async updateStudent(id: number, updateStudentDTO: UpdateStudentDTO): Promise<IUpdateResponse> {
    const studentToUpdate: Student = await this.verifyStudentId(id);
    const updatedData: Partial<Student> = await this.validateStudentUpdate(id, updateStudentDTO, studentToUpdate);
    const updatedStudent: Student = Object.assign(studentToUpdate, updatedData);

    await this.studentRepository.saveStudent(updatedStudent);
    return { message: 'Dados atualizados com sucesso!' };
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

  /**
   * Deleta um estudante do banco de dados.
   *
   * @param id - O identificador único do estudante a ser deletado.
   * @throws {NotFoundError} Se o estudante não for encontrado.
   */
  public async deleteStudent(id: number): Promise<void> {
    const student: Student = await this.verifyStudentId(id);
    await this.studentRepository.deleteStudent(student);
  }

  /**
   * Recupera uma lista de estudantes com base nos filtros fornecidos.
   *
   * @param {object} filters - Um objeto contendo os filtros para a consulta.
   * @param {number} filters.schoolId - O ID da escola para filtrar os estudantes.
   * @param {string} filters.fullName - O nome completo para filtrar os estudantes.
   * @returns {Promise<Student[]>} Uma promessa que resolve para um array de estudantes que correspondem aos filtros.
   */
  public async listStudents(filters: object): Promise<Student[]> {
    const schoolId: number = filters['schoolId'];
    const fullName: string = filters['fullName'];
    return this.studentRepository.listStudents(schoolId, fullName);
  }

  /**
   * Lista estudantes por turma com base nos filtros fornecidos.
   *
   * @param {object} filters - Os filtros a serem aplicados ao listar os estudantes.
   * @param {number} filters.classId - O ID da turma para filtrar os estudantes.
   * @param {number} filters.schoolId - O ID da escola para filtrar os estudantes.
   * @param {string} filters.fullName - O nome completo para filtrar os estudantes.
   * @returns {Promise<Student[]>} Uma promessa que resolve para um array de estudantes.
   */
  public async listStudentsByClass(filters: object): Promise<Student[]> {
    const classId: number = filters['classId'];
    const schoolId: number = filters['schoolId'];
    const fullName: string = filters['fullName'];
    return this.studentRepository.listStudentsByClass(classId, schoolId, fullName);
  }
}
