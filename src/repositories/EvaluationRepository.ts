import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Evaluation } from '../entities';
import { NotFoundError } from '../errors';

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
   * @param id - O ID único da avaliação.
   * @returns A avaliação encontrada ou lança um erro caso não exista.
   * @throws {NotFoundError} Se a avaliação não for encontrada.
   */
  public async getEvaluationById(id: number): Promise<Evaluation> {
    const evaluation = await this.repository.findOne({
      where: { id },
      relations: ['student', 'student.studentClass']
    });

    if (!evaluation) {
      throw new NotFoundError('Avaliação não encontrada.');
    }

    return evaluation;
  }

  /**
   * Busca todas as avaliações de um estudante.
   *
   * @param studentId - ID do estudante para buscar as avaliações.
   * @returns Uma promise que resolve para uma lista de avaliações ordenadas pela data de criação em ordem ascendente.
   */
  public findAllByStudentId(studentId: number): Promise<Evaluation[]> {
    return this.repository.find({
      where: { student: { id: studentId } },
      relations: ['student', 'student.studentClass'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Busca a última avaliação de um estudante.
   *
   * @param studentId - ID do estudante para buscar a última avaliação.
   * @returns Uma promise que resolve para a última avaliação encontrada ou null caso o estudante não tenha avaliações.
   */
  public findLatestByStudentId(studentId: number): Promise<Evaluation | null> {
    return this.repository.findOne({
      where: { student: { id: studentId } },
      relations: ['student', 'student.studentClass'],
      order: { createdAt: 'DESC' }
    });
  }
}
