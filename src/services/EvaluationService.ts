import { Service } from 'typedi';
import { Evaluation, Student, Teacher } from '../entities';
import { NotFoundError } from '../errors';
import { CreateEvaluationDTO, ICreationSucessResponse, IEvaluationData, IEvaluationReviews, IEvaluationStudent } from '../models';
import { EvaluationRepository, StudentRepository, TeacherRepository } from '../repositories';
import { formatToDDMMYY } from '../utils';

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

  /**
   * Busca uma avaliação pelo ID.
   *
   * @param {number} id - ID único da avaliação.
   * @returns {Promise<Evaluation>} - Retorna a avaliação encontrada.
   * @throws {NotFoundError} - Se a avaliação não for encontrada.
   */
  public async getEvaluationById(id: number): Promise<Evaluation> {
    const evaluation: Evaluation = await this.evaluationRepository.getEvaluationById(id);
    if (!evaluation) throw new NotFoundError('Esta avaliação não foi encontrada');
    return evaluation;
  }

  /**
   * Mapeia os dados do estudante a partir de uma avaliação.
   *
   * @param {Evaluation} evaluation - A avaliação contendo os dados do estudante.
   * @returns {IEvaluationStudent} - Dados do estudante formatados.
   */
  public mapEvaluationStudent(evaluation: Evaluation): IEvaluationStudent {
    return {
      id: evaluation.student.id,
      fullName: evaluation.student.fullName,
      studentClass: evaluation.student.studentClass.name
    };
  }

  /**
   * Mapeia as pontuações da avaliação para um formato específico.
   *
   * @param {Evaluation} evaluation - A avaliação contendo as pontuações.
   * @returns {IEvaluationReviews} - Dados formatados das pontuações.
   */
  public mapEvaluationReviews(evaluation: Evaluation): IEvaluationReviews {
    return {
      selfAwareness: evaluation.selfAwareness,
      empathy: evaluation.empathy,
      communication: evaluation.communication,
      teamwork: evaluation.teamwork,
      autonomy: evaluation.autonomy
    };
  }

  /**
   * Retorna os detalhes completos de uma avaliação formatados.
   *
   * @param {number} evaluationId - ID único da avaliação.
   * @returns {Promise<IEvaluationData>} - Detalhes da avaliação no formato esperado.
   *
   */
  public async showEvaluation(evaluationId: number): Promise<IEvaluationData> {
    const evaluation: Evaluation = await this.getEvaluationById(evaluationId);
    const formattedDate: string = formatToDDMMYY(evaluation.createdAt);

    const student: IEvaluationStudent = this.mapEvaluationStudent(evaluation);
    const reviews: IEvaluationReviews = this.mapEvaluationReviews(evaluation);

    return { id: evaluation.id, date: formattedDate, student, reviews, teacherComments: evaluation.teacherComments };
  }
}
