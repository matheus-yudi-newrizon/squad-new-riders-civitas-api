import { Service } from 'typedi';
import { School } from '../entities/School';
import { CreateClassDTO } from '../models/DTO/CreateClassDTO';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { ClassRepository } from '../repositories/ClassRepository';
import { SchoolRepository } from '../repositories/SchoolRepository';
import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';
import { SchoolYear } from '../models/enums/SchoolYear';
import { SchoolShift } from '../models/enums/SchoolShift';
import { EducationType } from '../models/enums/EducationType';

@Service()
export class ClassService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly schoolRepository: SchoolRepository
  ) {}

  /**
   * Verifica a existência da escola e a duplicidade da turma, e cria uma nova turma caso não haja conflitos.
   *
   * @param createClassDTO - Dados da turma a ser criada.
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
   * Verifica a existência de uma escola com base no ID fornecido.
   *
   * @param id - ID da escola.
   * @returns A instância de `School` se encontrada.
   * @throws BadRequestError - Se a escola não for encontrada.
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
