import { Service } from 'typedi';
import { Class, School } from '../entities';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { CreateClassDTO, EducationType, ICreationSucessResponse, IUpdateResponse, SchoolShift, SchoolYear } from '../models';
import { ClassRepository, SchoolRepository } from '../repositories';

@Service()
export class ClassService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly schoolRepository: SchoolRepository
  ) {}

  /**
   * Cria uma nova turma caso a escola seja válida e não haja duplicidade com turmas existentes.
   *
   * @param createClassDTO - Dados para criação da turma.
   * @param schoolId - ID da escola associada.
   * @returns Um objeto contendo uma mensagem de sucesso.
   * @throws BadRequestError - Se a escola não for encontrada.
   * @throws ConflictError - Se já existir uma turma com a mesma combinação de dados.
   */
  public async createClassWithValidation(createClassDTO: CreateClassDTO, schoolId: number): Promise<ICreationSucessResponse> {
    const school = await this.verifySchool(schoolId);

    const isDuplicate = await this.verifyClassDuplicate(
      createClassDTO.name,
      createClassDTO.schoolYear,
      createClassDTO.schoolShift,
      createClassDTO.educationType,
      schoolId
    );

    if (isDuplicate) throw new ConflictError('O apelido da turma já existe para as seleções feitas.');

    const newClass = this.classRepository.createClass({ ...createClassDTO, school });
    await this.classRepository.saveClass(newClass);

    return { message: 'Cadastro realizado com sucesso.' };
  }

  /**
   * Atualiza os detalhes de uma turma existente.
   *
   * @param classId - O ID da turma a ser atualizada.
   * @param updateClassDTO - O objeto de transferência de dados contendo os detalhes atualizados da turma.
   * @returns Uma promessa que resolve para um objeto contendo uma mensagem de sucesso.
   * @throws NotFoundError - Se a turma com o ID especificado não for encontrada.
   * @throws ConflictError - Se os detalhes atualizados da turma entrarem em conflito com uma turma existente.
   */
  public async updateClass(classId: number, updateClassDTO: CreateClassDTO): Promise<IUpdateResponse> {
    const classEntity: Class = await this.classRepository.findById(classId);
    if (!classEntity) throw new NotFoundError('Turma não encontrada.');

    const isDuplicate: boolean = await this.verifyClassDuplicate(
      updateClassDTO.name,
      updateClassDTO.schoolYear,
      updateClassDTO.schoolShift,
      updateClassDTO.educationType,
      classEntity.school.id
    );
    if (isDuplicate) throw new ConflictError('Verifique as informações digitadas ou cadastre novos dados');

    const updateClass: Class = Object.assign(classEntity, updateClassDTO);
    await this.classRepository.saveClass(updateClass);

    return { message: 'Dados da turma atualizados!' };
  }

  /**
   * Exclui uma turma pelo seu ID.
   *
   * @param classId - O ID da turma a ser excluída.
   * @throws {NotFoundError} Se a turma com o ID fornecido não for encontrada.
   * @throws {ConflictError} Se a turma estiver associada a estudantes ou professores.
   * @returns {Promise<void>} Uma promessa que é resolvida quando a turma é excluída.
   */
  public async deleteClass(classId: number): Promise<void> {
    const classEntity: Class = await this.getClassById(classId);
    if (!classEntity) throw new NotFoundError('Turma não encontrada.');

    if (classEntity.students?.length > 0 || classEntity.teacherClasses?.length > 0) {
      throw new ConflictError('Turma está associada à professores ou estudantes. Remova para prosseguir na exclusão da turma');
    }

    await this.classRepository.deleteClass(classEntity);
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
   * Lista todas as turmas de uma escola com filtros opcionais.
   *
   * @param filters - Filtros opcionais para listar as turmas.
   * @returns Uma lista de turmas que atendem aos filtros fornecidos.
   */
  public async listClasses(filters: { schoolYear?: string; educationType?: string; schoolShift?: string; schoolId: number }): Promise<Class[]> {
    return await this.classRepository.findClassesWithFilters(filters);
  }

  /**
   * Busca uma turma específica pelo ID.
   *
   * @param classId - ID da turma a ser buscada.
   * @returns A instância de `Class` encontrada.
   * @throws NotFoundError - Se a turma não for encontrada.
   */
  public async getClassById(classId: number): Promise<Class> {
    const classEntity = await this.classRepository.findById(classId);
    if (!classEntity) throw new NotFoundError('Turma não encontrada.');
    return classEntity;
  }

  /**
   * Verifica se uma escola existe com base no ID fornecido.
   *
   * @param id - ID da escola.
   * @returns A entidade `School` se a escola for encontrada.
   * @throws BadRequestError - Se a escola não for encontrada no banco de dados.
   */
  private async verifySchool(id: number): Promise<School> {
    const school = await this.schoolRepository.findByID(id);
    if (!school) throw new BadRequestError('Escola não encontrada');
    return school;
  }

  /**
   * Verifica a duplicidade de uma turma com base nos dados fornecidos.
   *
   * @param name - Nome da turma.
   * @param schoolYear - Ano escolar da turma.
   * @param schoolShift - Turno escolar da turma.
   * @param educationType - Tipo de educação da turma.
   * @param schoolId - ID da escola associada à turma.
   * @returns `true` se uma turma duplicada for encontrada, caso contrário `false`.
   */
  private async verifyClassDuplicate(
    name: string,
    schoolYear: SchoolYear,
    schoolShift: SchoolShift,
    educationType: EducationType,
    schoolId: number
  ): Promise<boolean> {
    const isDuplicate = await this.classRepository.findDuplicateClass(name, schoolYear, schoolShift, educationType, schoolId);
    return !!isDuplicate;
  }
}
