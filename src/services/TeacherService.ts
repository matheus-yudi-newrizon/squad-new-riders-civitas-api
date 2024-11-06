import { Service } from 'typedi';
import { School } from '../entities/School';
import { CreateTeacherDTO } from '../models/DTO/CreateTeacherDTO';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { SchoolRepository } from '../repositories/SchoolRepository';
import { ConflictError } from '../errors/ConflictError';
import { BadRequestError } from '../errors/BadRequestError';

@Service()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly schoolRepository: SchoolRepository
  ) {}

  /**
   * Cria um novo professor caso a escola exista e não haja duplicidade de matrícula.
   *
   * Este método verifica a existência da escola associada e se já existe um professor com o mesmo
   * número de matrícula para a escola especificada. Se a escola for encontrada e não houver duplicidade,
   * um novo professor é criado e salvo no banco de dados, juntamente com sua associação à escola.
   *
   * @param createTeacherDTO - Dados do professor a ser criado, incluindo nome, CPF e número de matrícula.
   * @param schoolId - ID da escola à qual o professor será associado.
   * @returns Um objeto contendo uma mensagem de sucesso.
   * @throws BadRequestError - Se a escola não for encontrada no banco de dados.
   * @throws ConflictError - Se já existir um professor com o mesmo número de matrícula na escola.
   */
  public async createTeacherWithValidation(createTeacherDTO: CreateTeacherDTO, schoolId: number): Promise<ICreationSucessResponse> {
    const school = await this.verifySchool(schoolId);

    const isDuplicateRegistrationNumber = await this.verifyRegistrationNumberDuplicate(createTeacherDTO.registrationNumber, schoolId);
    if (isDuplicateRegistrationNumber) {
      throw new ConflictError('O número de matrícula já está em uso para esta escola.');
    }

    // Cria uma nova instância de professor e salva no banco de dados
    const newTeacher = this.teacherRepository.createTeacher({
      fullName: createTeacherDTO.fullName,
      cpf: createTeacherDTO.cpf
    });
    await this.teacherRepository.saveTeacher(newTeacher);

    // Cria uma nova associação entre o professor e a escola e salva no banco de dados
    const teacherSchool = this.teacherRepository.createTeacherSchool({
      teacher: newTeacher,
      school: school,
      registrationNumber: createTeacherDTO.registrationNumber
    });
    await this.teacherRepository.saveTeacherSchool(teacherSchool);

    return { message: 'Cadastro de professor realizado com sucesso.' };
  }

  /**
   * Verifica se a escola existe no banco de dados.
   *
   * @param id - ID da escola a ser verificada.
   * @returns A entidade `School` se a escola for encontrada.
   * @throws BadRequestError - Se a escola não for encontrada no banco de dados.
   */
  private async verifySchool(id: number): Promise<School> {
    const school = await this.schoolRepository.findByID(id);
    if (!school) throw new BadRequestError('Escola não encontrada');
    return school;
  }

  /**
   * Verifica se um número de matrícula duplicado existe no banco de dados para uma escola.
   *
   * @param registrationNumber - Número de matrícula a ser verificado.
   * @param schoolId - ID da escola associada.
   * @returns `true` se um professor com o mesmo número de matrícula for encontrado, caso contrário, `false`.
   */
  private async verifyRegistrationNumberDuplicate(registrationNumber: string, schoolId: number): Promise<boolean> {
    const teacherSchoolExists = await this.teacherRepository.findTeacherSchoolByRegistrationAndSchool(registrationNumber, schoolId);
    return !!teacherSchoolExists;
  }
}
