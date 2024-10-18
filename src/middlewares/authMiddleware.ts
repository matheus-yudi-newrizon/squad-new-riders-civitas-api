import { NextFunction, Response } from 'express';
import { IAuthJWTRequest } from 'interfaces/IAuthJWTRequest';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '../services/JwtService';
import { InvalidJWTTokenError, UnauthorizedError } from '../utils/apiErrors';

const jwtService = new JwtService();

/**
 * Middleware para proteger rotas que precisam de autenticação.
 *
 * Verifica o token JWT presente no cabeçalho Authorization.
 * Se o token for válido, adiciona as informações do usuário ao `req.user`.
 *
 * @param req - A requisição HTTP
 * @param res - A resposta HTTP
 * @param next - Função que passa o controle para o próximo middleware ou rota
 */
export const authMiddleware = (req: IAuthJWTRequest, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token não consta na requisição');
  }

  const token: string = authHeader.split(' ')[1];
  const decoded: string | JwtPayload = jwtService.verifyToken(token);

  if (typeof decoded === 'string') {
    throw new InvalidJWTTokenError('Token inválido ou expirado');
  }

  req.token = decoded;

  next();
};
