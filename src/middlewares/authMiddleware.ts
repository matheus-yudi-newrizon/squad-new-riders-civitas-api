import { NextFunction, Response } from 'express';
import { IAuthJWTRequest } from 'interfaces/IAuthJWTRequest';
import { VerifyErrors } from 'jsonwebtoken';
import { JwtService } from '../services/JwtService';
import { InvalidJWTTokenError, UnauthorizedError } from '../utils/apiErrors';

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

    if (typeof decoded !== 'string') {
      req.token = decoded;
    } else {
      return next(new InvalidJWTTokenError('Token inválido.'));
    }

    next();
  });
};
