import { cpf } from 'cpf-cnpj-validator';
import { Service } from 'typedi';
import { Class, School, Teacher, TeacherClass, TeacherSchool } from '../entities';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { CreateTeacherDTO, ICreationSucessResponse, ITeacherMap, IUpdateResponse, UpdateTeacherDTO } from '../models';
import { ClassRepository, SchoolRepository, TeacherRepository } from '../repositories';
import { EntityMapper } from './EntityMapper';

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
   * Atualiza os dados de um professor, incluindo informações pessoais,
   * número de matrícula e associação com turmas.
   *
   * @param teacherId - ID do professor a ser atualizado.
   * @param schoolId - ID da escola associada ao professor.
   * @param updateTeacherDTO - Dados para atualização do professor.
   * @returns Retorna uma mensagem de sucesso após a atualização.
   * @throws {NotFoundError} Se o professor não for encontrado.
   * @throws {ConflictError} Se o CPF ou número de matrícula já estiver em uso.
   */
  public async updateTeacher(teacherId: number, schoolId: number, updateTeacherDTO: UpdateTeacherDTO): Promise<IUpdateResponse> {
    const teacher: Teacher = await this.getTeacherById(teacherId);
    await this.updateTeacherData(teacher, updateTeacherDTO);

    if (updateTeacherDTO.registrationNumber) await this.updateTeacherSchool(teacherId, schoolId, updateTeacherDTO);
    if (updateTeacherDTO.classes) await this.updateTeacherClasses(teacherId, updateTeacherDTO.classes);

    return { message: 'Dados do professor atualizados!' };
  }

  /**
   * Atualiza as informações pessoais de um professor.
   *
   * @param teacher - Entidade do professor a ser atualizada.
   * @param updateTeacherDTO - Dados para atualizar as informações do professor.
   * @throws {ConflictError} Se o CPF já estiver em uso por outro professor.
   */
  private async updateTeacherData(teacher: Teacher, updateTeacherDTO: UpdateTeacherDTO) {
    if (updateTeacherDTO.fullName) teacher.fullName = updateTeacherDTO.fullName;

    if (updateTeacherDTO.cpf) {
      const unmaskedCpf: string = cpf.strip(updateTeacherDTO.cpf);
      await this.verifyCPFDuplicate(unmaskedCpf, teacher.id);
      teacher.cpf = updateTeacherDTO.cpf;
    }
    await this.teacherRepository.saveTeacher(teacher);
  }

  /**
   * Atualiza a relação entre professor e escola, incluindo o número de matrícula.
   *
   * @param teacherId - ID do professor.
   * @param schoolId - ID da escola associada.
   * @param updateTeacherDTO - Dados de atualização, incluindo número de matrícula.
   * @throws {NotFoundError} Se a relação professor-escola não existir.
   * @throws {ConflictError} Se o número de matrícula já estiver em uso.
   */
  private async updateTeacherSchool(teacherId: number, schoolId: number, updateTeacherDTO: UpdateTeacherDTO) {
    const registrationNumber: string = updateTeacherDTO.registrationNumber;
    const teacherSchool: TeacherSchool = await this.teacherRepository.findTeacherSchoolByTeacherAndSchool(teacherId, schoolId);
    if (!teacherSchool) throw new NotFoundError('Professor não encontrado nesta escola');

    await this.verifyRegistrationNumberDuplicateUpdate(teacherSchool, registrationNumber, teacherId, schoolId);

    teacherSchool.registrationNumber = registrationNumber;

    await this.teacherRepository.saveTeacherSchool(teacherSchool);
  }

  /**
   * Atualiza as turmas associadas a um professor.
   *
   * @param teacherId - ID do professor.
   * @param classIds - IDs das turmas a serem associadas ao professor.
   */
  private async updateTeacherClasses(teacherId: number, classIds: number[]) {
    const selectedClasses: Class[] = await this.classRepository.findByIds(classIds);

    await this.teacherRepository.removeTeacherClassesByTeacherId(teacherId);

    const teacherClasses: TeacherClass[] = selectedClasses.map(classEntity => {
      return this.teacherRepository.createTeacherClass({
        teacher: { id: teacherId } as Teacher,
        class: classEntity
      });
    });

    await this.teacherRepository.saveTeacherClasses(teacherClasses);
  }

  /**
   * Remove um professor, incluindo suas associações com escola e turmas.
   *
   * @param teacherId - ID do professor a ser removido.
   * @param schoolId - ID da escola associada ao professor.
   * @throws {NotFoundError} Se o professor não for encontrado na escola.
   */
  public async deleteTeacher(teacherId: number, schoolId: number): Promise<void> {
    const teacherSchool: TeacherSchool = await this.teacherRepository.findTeacherSchoolByTeacherAndSchool(teacherId, schoolId);
    if (!teacherSchool) throw new NotFoundError('Professor não encontrado nesta escola.');

    await this.teacherRepository.removeTeacherSchool(teacherSchool);
    await this.teacherRepository.removeTeacherClassesByTeacherId(teacherId);
    await this.teacherRepository.removeTeacher(teacherId);
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
    return teacher;
  }

  /**
   * Busca um professor específico pelo ID e retorna os dados mapeados.
   *
   * @param teacherId - ID do professor a ser buscado.
   * @param schoolId - ID da escola associada ao professor.
   * @returns Os dados mapeados do professor.
   */
  public async getTeacherInfo(teacherId: number, schoolId?: number): Promise<ITeacherMap> {
    const teacher = await this.teacherRepository.findById(teacherId);
    const registrationNumber: string = await this.getRegistrationNumber(teacherId, schoolId);
    const mappedTeacher: ITeacherMap = EntityMapper.mapTeacher(teacher);
    return { ...mappedTeacher, registrationNumber };
  }

  /**
   * Busca o número de registro de um professor na escola.
   *
   * @param cpf - CPF do professor a ser buscado.
   * @returns A instância de `Teacher` encontrada.
   * @throws NotFoundError - Se o professor não for encontrado.
   */
  private async getRegistrationNumber(teacherId: number, schoolId: number): Promise<string> {
    const teacherSchool: TeacherSchool = await this.teacherRepository.findTeacherSchoolByTeacherAndSchool(teacherId, schoolId);
    if (!teacherSchool) throw new NotFoundError('Professor não encontrado nesta escola.');
    return teacherSchool.registrationNumber;
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
   * Lista todos os professores de uma escola específica, incluindo as turmas de cada professor.
   *
   * Este método utiliza o método `findTeachersBySchoolIdWithClasses` do repositório para buscar os professores
   * associados à escola com as turmas em que cada professor foi cadastrado.
   *
   * @param schoolId - ID da escola.
   * @returns Uma lista de professores com suas turmas associadas.
   * @throws NotFoundError - Se nenhum professor for encontrado para a escola.
   */
  public async listTeachersBySchoolWithClasses(schoolId: number): Promise<Teacher[]> {
    const teachers = await this.teacherRepository.findTeachersBySchoolIdWithClasses(schoolId);
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

  /**
   * Verifica a duplicidade do número de matrícula para evitar conflitos durante a atualização.
   *
   * @param teacherSchool - Relação existente entre professor e escola.
   * @param registrationNumber - Número de matrícula a ser verificado.
   * @param teacherId - ID do professor.
   * @param schoolId - ID da escola associada.
   * @throws {ConflictError} Se o número de matrícula já estiver em uso por outra relação.
   */
  private async verifyRegistrationNumberDuplicateUpdate(
    teacherSchool: TeacherSchool,
    registrationNumber: string,
    teacherId: number,
    schoolId: number
  ): Promise<void> {
    const isDuplicateRegistrationNumber: boolean = await this.verifyRegistrationNumberDuplicate(registrationNumber, schoolId);
    if (isDuplicateRegistrationNumber && teacherSchool.registrationNumber !== registrationNumber)
      throw new ConflictError('O número de matrícula já está em uso para esta escola.');
  }

  /**
   * Verifica a duplicidade de CPF para evitar conflitos ao atualizar ou criar um professor.
   *
   * @param cpf - CPF a ser verificado.
   * @param teacherId - ID do professor.
   * @throws {ConflictError} Se o CPF já estiver em uso por outro professor.
   */
  private async verifyCPFDuplicate(cpf: string, teacherId: number): Promise<void> {
    const existingTeacher: Teacher = await this.teacherRepository.findByCpf(cpf);
    if (existingTeacher && existingTeacher.id !== teacherId) throw new ConflictError('CPF já cadastrado para outro professor.');
  }
}
