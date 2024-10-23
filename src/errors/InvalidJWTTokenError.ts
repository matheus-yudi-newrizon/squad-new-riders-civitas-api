import { ApiError } from './ApiErrors';
/**
 * Classe que representa um erro de requisição não autorizada associado ao Token JWT (401).
 * Extende a classe `ApiError` e define o statusCode como 401.
 */
export class InvalidJWTTokenError extends ApiError {
  /**
   * Constrói uma nova instância de `InvalidJWTTokenError`.
   *
   * @param message - A mensagem de erro associada.
   */
  constructor(message: string) {
    super(message, 401);
  }
}
