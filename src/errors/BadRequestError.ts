import { ApiError } from './ApiErrors';
/**
 * Classe que representa um erro de requisição inválida (400).
 * Extende a classe `ApiError` e define o statusCode como 400.
 */
export class BadRequestError extends ApiError {
  /**
   * Constrói uma nova instância de `BadRequestError`.
   *
   * @param message - A mensagem de erro associada.
   */
  constructor(message: string) {
    super(message, 400);
  }
}
