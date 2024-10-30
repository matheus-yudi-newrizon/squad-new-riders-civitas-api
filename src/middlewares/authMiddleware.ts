import { NextFunction, Response } from 'express';
import { VerifyErrors } from 'jsonwebtoken';
import { InvalidJWTTokenError } from '../errors/InvalidJWTTokenError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { IAuthJWTRequest } from '../models/interfaces/IAuthJWTRequest';
import { JwtService } from '../services/JwtService';

const jwtService = new JwtService();

/**
 * Middleware para proteger rotas que precisam de autenticação.
 *
 * Verifica o token JWT presente no cabeçalho Authorization.
 * Se o token for válido, adiciona as informações do usuário ao `req.token`.
 *
 * @param req - A requisição HTTP
 * @param res - A resposta HTTP
 * @param next - Função que passa o controle para o próximo middleware ou rota
 */
export const authMiddleware = (req: IAuthJWTRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token não consta na requisição.');
  }

  const token = authHeader.split(' ')[1];

  jwtService.verifyToken(token, (err: VerifyErrors | null, decoded) => {
    if (err) {
      return next(new InvalidJWTTokenError('Token inválido ou expirado.'));
    }

    if (typeof decoded !== 'string' && decoded.schoolId) {
      res.locals.schoolId = decoded.schoolId;
    } else {
      return next(new InvalidJWTTokenError('Token inválido.'));
    }

    next();
  });
};
