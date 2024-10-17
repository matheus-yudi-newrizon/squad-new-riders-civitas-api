import { Request, Response } from 'express';
import { ApiError } from 'utils/apiErrors';

/**
 * Middleware para tratar erros na aplicação.
 *
 * @param error - O objeto de erro, que pode incluir um statusCode opcional e uma mensagem.
 * @param req - O objeto da requisição.
 * @param res - O objeto da resposta.
 * @returns A resposta com o código de status apropriado e a mensagem de erro.
 */
export const errorMiddleware = (error: Error & Partial<ApiError>, req: Request, res: Response) => {
  const statusCode: number = error.statusCode ?? 500;
  const message: string = error.statusCode ? error.message : 'Erro interno no servidor. Tente novamente mais tarde.';
  return res.status(statusCode).json({ message });
};
