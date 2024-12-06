/**
 * Classe base para erros personalizados da aplicação.
 * Extende a classe nativa `Error` e adiciona um código de status HTTP.
 */
export class ApiError extends Error {
  /**
   * O código de status HTTP associado ao erro.
   */
  public readonly statusCode: number;

  /**
   * Constrói uma nova instância de `ApiError`.
   *
   * @param message - A mensagem de erro associada.
   * @param statusCode - O código de status HTTP associado ao erro.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
