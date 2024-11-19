import { ApiError } from './ApiErrors';
/**
 * Classe que representa um erro de recurso não encontrado (404).
 * Extende a classe `ApiError` e define o statusCode como 404.
 */
export class ForbiddenError extends ApiError {
  /**
   * Constrói uma nova instância de `ForbiddenError`.
   *
   * @param message - A mensagem de erro associada.
   */
  constructor(message: string) {
    super(message, 403);
  }
}
