import { NextFunction, Request } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError';
import { CustomResponse } from '../models/interfaces/ICustomResponse';

/**
 * @middleware roleMiddleware
 * @description Middleware para controle de acesso baseado em papéis (roles) de usuário.
 *
 * Este middleware verifica se o usuário autenticado possui uma role permitida para acessar a rota.
 * As roles permitidas são especificadas como um array no momento da configuração do middleware.
 * Caso o usuário não tenha a role necessária, uma exceção será lançada com código HTTP 403 (Forbidden).
 *
 * @param allowedRoles - Um array de strings representando as roles permitidas para a rota.
 *                       Exemplo: ['admin', 'teacher'].
 *
 * @throws ForbiddenError - Lançado quando o usuário não possui uma das roles permitidas.
 *
 *
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: CustomResponse, next: NextFunction) => {
    const userRole = res.locals.role;

    if (!userRole) throw new ForbiddenError('Usuário não autorizado');
    if (!allowedRoles.includes(userRole)) throw new ForbiddenError('Você não tem permissão para acessar este recurso');

    next();
  };
};
