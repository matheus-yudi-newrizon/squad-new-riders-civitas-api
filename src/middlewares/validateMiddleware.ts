import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors';

/**
 * Middleware para validar dados da requisição usando um DTO específico.
 *
 * @template T - Tipo do DTO usado para validação.
 * @param type - O construtor do DTO que define as regras de validação.
 * @returns Middleware que valida os dados da requisição e, em caso de sucesso, chama o próximo middleware
 * ou controlador.
 */

export function validationMiddleware<T>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || Object.keys(req.body).length === 0) return next(new BadRequestError('O corpo da requisição está vazio.'));

    const dtoInstance = Object.assign(new type(), req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const validationErrors = errors.map(err => Object.values(err.constraints)).flat();
      return next(new BadRequestError(`Erro de validação: ${validationErrors.join('; ')}`));
    }

    next();
  };
}
