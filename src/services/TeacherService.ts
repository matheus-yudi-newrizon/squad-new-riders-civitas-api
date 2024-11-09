import { Service } from 'typedi';
import { School } from '../entities/School';
import { Class } from '../entities/Class';
import { Teacher } from '../entities/Teacher';
import { CreateTeacherDTO } from '../models/DTO/CreateTeacherDTO';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { ClassRepository } from '../repositories/ClassRepository';
import { SchoolRepository } from '../repositories/SchoolRepository';
import { ConflictError } from '../errors/ConflictError';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';

@Service()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly classRepository: ClassRepository,
    private readonly schoolRepository: SchoolRepository
  ) {}

  /**
   * Cria um novo professor e associa-o a uma escola e a turmas existentes.
   *
   * Este método verifica a existência da escola e se já existe um professor com o mesmo
   * número de matrícula para a escola. Em seguida, cria o professor e associa-o às turmas.
   *
   * @param createTeacherDTO - Dados do professor, incluindo nome, CPF, número de matrícula e IDs de turmas.
   * @param schoolId - ID da escola associada ao professor.
   * @returns Um objeto contendo uma mensagem de sucesso.
   * @throws BadRequestError - Se a escola não for encontrada.
   * @throws ConflictError - Se o número de matrícula já estiver em uso na escola.
   */
  public async createTeacherWithValidation(createTeacherDTO: CreateTeacherDTO, schoolId: number): Promise<ICreationSucessResponse> {
    const school = await this.verifySchool(schoolId);

    const isDuplicateRegistrationNumber = await this.verifyRegistrationNumberDuplicate(createTeacherDTO.registrationNumber, schoolId);
    if (isDuplicateRegistrationNumber) {
      throw new ConflictError('O número de matrícula já está em uso para esta escola.');
    }

    const newTeacher = this.teacherRepository.createTeacher({
      fullName: createTeacherDTO.fullName,
      cpf: createTeacherDTO.cpf
    });
    await this.teacherRepository.saveTeacher(newTeacher);

    const selectedClasses = await this.classRepository.findByIds(createTeacherDTO.classes);
    const teacherClasses = selectedClasses.map(classEntity => {
      return this.teacherRepository.createTeacherClass({
        teacher: newTeacher,
        class: classEntity
      });
    });
    await this.teacherRepository.saveTeacherClasses(teacherClasses);

    const teacherSchool = this.teacherRepository.createTeacherSchool({
      teacher: newTeacher,
      school: school,
      registrationNumber: createTeacherDTO.registrationNumber
    });
    await this.teacherRepository.saveTeacherSchool(teacherSchool);

    return { message: 'Cadastro de professor realizado com sucesso.' };
  }

  /**
   * Busca um professor específico pelo ID.
   *
   * @param teacherId - ID do professor a ser buscado.
   * @returns A instância de `Teacher` encontrada.
   * @throws NotFoundError - Se o professor não for encontrado.
   */
  public async getTeacherById(teacherId: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(teacherId);
    if (!teacher) throw new NotFoundError('Professor não encontrado.');
    return teacher;
  }

  /**
   * Lista todas as turmas associadas a um professor específico.
   *
   * @param teacherId - ID do professor.
   * @returns Uma lista de turmas associadas ao professor.
   * @throws NotFoundError - Se nenhuma turma for encontrada para o professor.
   */
  public async listClassesByTeacher(teacherId: number): Promise<Class[]> {
    const classes = await this.classRepository.findByTeacherId(teacherId);
    if (!classes.length) throw new NotFoundError('Nenhuma turma encontrada para o professor especificado.');
    return classes;
  }

  /**
   * Lista todos os professores associados a uma escola específica.
   *
   * @param schoolId - ID da escola.
   * @returns Uma lista de professores associados à escola.
   * @throws NotFoundError - Se nenhum professor for encontrado para a escola.
   */
  public async listTeachersBySchool(schoolId: number): Promise<Teacher[]> {
    const teachers = await this.teacherRepository.findTeachersBySchoolId(schoolId);
    if (!teachers.length) throw new NotFoundError('Nenhum professor encontrado para a escola especificada.');
    return teachers;
  }

  /**
   * Verifica se a escola existe no banco de dados.
   *
   * @param id - ID da escola a ser verificada.
   * @returns A entidade `School` se a escola for encontrada.
   * @throws BadRequestError - Se a escola não for encontrada.
   */
  private async verifySchool(id: number): Promise<School> {
    const school = await this.schoolRepository.findByID(id);
    if (!school) throw new BadRequestError('Escola não encontrada');
    return school;
  }

  /**
   * Verifica se um número de matrícula duplicado existe para uma escola.
   *
   * @param registrationNumber - Número de matrícula.
   * @param schoolId - ID da escola.
   * @returns `true` se o número de matrícula for duplicado, `false` caso contrário.
   */
  private async verifyRegistrationNumberDuplicate(registrationNumber: string, schoolId: number): Promise<boolean> {
    const teacherSchoolExists = await this.teacherRepository.findTeacherSchoolByRegistrationAndSchool(registrationNumber, schoolId);
    return !!teacherSchoolExists;
  }
}
