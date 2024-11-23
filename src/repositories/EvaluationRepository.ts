import { Service as Repository } from 'typedi';
import { Repository as TypeORMRepository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Evaluation } from '../entities/Evaluation';

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
}
