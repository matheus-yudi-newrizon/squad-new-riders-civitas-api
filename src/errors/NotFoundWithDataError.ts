import { ApiError } from './ApiErrors';
/**
 * Classe que representa um erro de recurso não encontrado (404).
 * Extende a classe `ApiError` e define o statusCode como 404 e traz informações adicionais.
 */
export class NotFoundWithDataError extends ApiError {
  public studentInfo: object;
  /**
   * Constrói uma nova instância de `NotFoundError`.
   *
   * @param message - A mensagem de erro associada.
   * @param studentInfo - Informações adicionais sobre o estudante.
   */
  constructor(message: string, studentInfo?: object) {
    super(message, 404);
    this.studentInfo = studentInfo;
  }
}
