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

/**
 * Classe que representa um erro de requisição inválida por campos não preenchidos (400).
 * Extende a classe `ApiError` e define o statusCode como 400.
 */
export class MissingRequiredFields extends ApiError {
  /**
   * Constrói uma nova instância de `MissingRequiredFieldError`.
   *
   * @param message - A mensagem de erro associada.
   */
  constructor(message: string) {
    super(message, 400);
  }
}

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
