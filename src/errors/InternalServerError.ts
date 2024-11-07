import { ApiError } from './ApiErrors';
/**
 * Classe que representa um erro no servidor (500).
 * Extende a classe `ApiError` e define o statusCode como 500.
 */
export class InternalServerError extends ApiError {
  /**
   * Constrói uma nova instância de `InternalServerError`.
   *
   * @param message - A mensagem de erro associada.
   */
  constructor(message: string) {
    super(message, 500);
  }
}
