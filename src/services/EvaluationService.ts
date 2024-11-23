import { Service } from 'typedi';
import { Teacher } from '../entities/Teacher';
import { Student } from '../entities/Student';
import { NotFoundError } from '../errors/NotFoundError';
import { CreateEvaluationDTO } from '../models/DTO/CreateEvaluationDTO';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';
import { EvaluationRepository } from '../repositories/EvaluationRepository';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { StudentRepository } from '../repositories/StudentRepository';

@Service()
export class EvaluationService {
  constructor(
    private readonly evaluationRepository: EvaluationRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly studentRepository: StudentRepository
  ) {}

  /**
   * Verifica a existência de um estudante pelo ID.
   *
   * @param studentId - ID do estudante.
   * @returns A instância do estudante encontrada.
   * @throws {NotFoundError} Se o estudante não for encontrado.
   */
  private async verifyStudent(studentId: number): Promise<Student> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Estudante não encontrado.');
    }
    return student;
  }

  /**
   * Verifica a existência de um professor pelo ID.
   *
   * @param teacherId - ID do professor.
   * @returns A instância do professor encontrada.
   * @throws {NotFoundError} Se o professor não for encontrado.
   */
  private async verifyTeacher(teacherId: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Professor não encontrado.');
    }
    return teacher;
  }

  /**
   * Cria uma nova avaliação de desempenho individual (ADI).
   *
   * @param createEvaluationDTO - Dados da avaliação a ser criada.
   * @param teacherId - ID do professor extraído do token JWT.
   * @returns Um objeto contendo uma mensagem de sucesso.
   * @throws {NotFoundError} Se o estudante ou professor não forem encontrados.
   */
  public async createEvaluation(createEvaluationDTO: CreateEvaluationDTO, teacherId: number): Promise<ICreationSucessResponse> {
    const student = await this.verifyStudent(createEvaluationDTO.studentId);

    const teacher = await this.verifyTeacher(teacherId);

    const evaluation = this.evaluationRepository.createEvaluation({
      student,
      teacher,
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      selfAwareness: createEvaluationDTO.selfAwareness,
      empathy: createEvaluationDTO.empathy,
      communication: createEvaluationDTO.communication,
      teamwork: createEvaluationDTO.teamwork,
      autonomy: createEvaluationDTO.autonomy,
      teacherComments: createEvaluationDTO.teacherComments
    });

    await this.evaluationRepository.saveEvaluation(evaluation);

    return { message: 'Avaliação criada com sucesso.' };
  }
}
