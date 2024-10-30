import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { BadRequestError } from '../errors/BadRequestError';

export function validationMiddleware<T>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = Object.assign(new type(), req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const validationErrors = errors.map(err => Object.values(err.constraints)).flat();
      return next(new BadRequestError(`Erro de validação: ${validationErrors.join('; ')}`));
    }

    next();
  };
}
