import { ApiError } from './ApiErrors';
/**
 * Classe que representa um erro de recurso não encontrado (404).
 * Extende a classe `ApiError` e define o statusCode como 404.
 */
export class NotFoundError extends ApiError {
  /**
   * Constrói uma nova instância de `NotFoundError`.
   *
   * @param message - A mensagem de erro associada.
   */
  constructor(message: string) {
    super(message, 404);
  }
}
