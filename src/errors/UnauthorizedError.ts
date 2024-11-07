import { ApiError } from './ApiErrors';
/**
 * Classe que representa um erro de autenticação falha (401).
 * Extende a classe `ApiError` e define o statusCode como 401.
 */
export class UnauthorizedError extends ApiError {
  /**
   * Constrói uma nova instância de `UnauthorizedError`.
   *
   * @param message - A mensagem de erro associada.
   */
  constructor(message: string) {
    super(message, 401);
  }
}
