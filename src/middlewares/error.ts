import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'utils/apiErrors';

/**
 * Middleware para tratar erros na aplicação.
 *
 * @param error - O objeto de erro, que pode incluir um statusCode opcional e uma mensagem.
 * @param req - O objeto da requisição.
 * @param res - O objeto da resposta.
 * @param _next - Mantido para garantir que o middleware seja identificado como middleware de erro, mesmo sem uso.
 * @returns A resposta com o código de status apropriado e a mensagem de erro.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (error: Error & Partial<ApiError>, req: Request, res: Response, _next: NextFunction) => {
  const statusCode: number = error.statusCode ?? 500;
  const message: string = error.statusCode ? error.message : 'Erro interno no servidor. Tente novamente mais tarde.';

  return res.status(statusCode).json({ message });
};
