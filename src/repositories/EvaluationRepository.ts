import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Evaluation } from '../entities';
@Repository()
export class EvaluationRepository {
  private repository: TypeORMRepository<Evaluation> = MysqlDataSource.getRepository(Evaluation);

  /**
   * Cria uma instância de avaliação com os dados fornecidos, mas não a salva no banco de dados.
   *
   * @param evaluationData - Dados parciais da avaliação que será criada.
   * @returns Uma instância de `Evaluation` criada, mas não persistida.
   */
  public createEvaluation(evaluationData: Partial<Evaluation>): Evaluation {
    return this.repository.create(evaluationData);
  }

  /**
   * Salva uma avaliação no banco de dados.
   *
   * @param evaluation - A instância da avaliação a ser salva.
   * @returns A instância de `Evaluation` após ser salva no banco de dados.
   */
  public async saveEvaluation(evaluation: Evaluation): Promise<Evaluation> {
    return await this.repository.save(evaluation);
  }

  /**
   * Busca uma avaliação pelo ID, incluindo as relações do estudante e sua turma.
   *
   * @param {number} id - O ID único da avaliação.
   * @returns {Promise<Evaluation | null>} - Retorna a avaliação encontrada ou `null` se não existir.
   */
  public async getEvaluationById(id: number): Promise<Evaluation | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['student', 'student.studentClass']
    });
  }

  /**
   * Busca todas as avaliações associadas a um estudante pelo ID, ordenadas da mais recente para a mais antiga.
   *
   * @param studentId - O ID do estudante cujas avaliações serão buscadas.
   * @returns Uma lista de avaliações do estudante, ordenadas por data de criação (mais recente primeiro).
   */
  public async findAllByStudentId(studentId: number): Promise<Evaluation[]> {
    return this.repository.find({
      where: { student: { id: studentId } },
      relations: ['student', 'student.studentClass'],
      order: { createdAt: 'ASC' }
    });
  }

  /**
   * Busca a avaliação mais recente de um estudante pelo ID.
   *
   * @param studentId - O ID do estudante cuja última avaliação será buscada.
   * @returns A avaliação mais recente associada ao estudante ou `null` se não houver avaliações.
   */
  public async findLatestByStudentId(studentId: number): Promise<Evaluation | null> {
    return this.repository.findOne({
      where: { student: { id: studentId } },
      relations: ['student', 'student.studentClass'],
      order: { createdAt: 'ASC' }
    });
  }
}
