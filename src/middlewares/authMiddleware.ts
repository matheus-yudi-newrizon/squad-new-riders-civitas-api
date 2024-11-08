import { NextFunction, Response } from 'express';
import { VerifyErrors } from 'jsonwebtoken';
import { InvalidJWTTokenError } from '../errors/InvalidJWTTokenError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { IAuthJWTRequest } from '../models/interfaces/IAuthJWTRequest';
import { JwtService } from '../services/JwTService';

const jwtService = new JwtService();

/**
 * Middleware de autenticação para proteger rotas que requerem um token JWT válido.
 *
 * Este middleware verifica a presença de um token JWT no cabeçalho `Authorization`.
 * Se o token estiver presente e for válido, as informações do usuário autenticado
 * são adicionadas ao `res.locals`, permitindo que outras partes da aplicação
 * acessem esses dados, como o `schoolId`.
 *
 * @param req - A requisição HTTP, que deve incluir o cabeçalho `Authorization` contendo o token JWT.
 * @param res - A resposta HTTP, onde as informações do usuário autenticado serão armazenadas em `res.locals`.
 * @param next - A função de callback para passar o controle ao próximo middleware ou rota.
 *
 * @throws UnauthorizedError - Lançado quando o cabeçalho `Authorization` não está presente na requisição.
 * @throws InvalidJWTTokenError - Lançado quando o token JWT está inválido ou expirado.
 *
 *
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

      if (decoded.teacherId) {
        res.locals.teacherId = decoded.teacherId;
      }
    } else {
      return next(new InvalidJWTTokenError('Token inválido.'));
    }

    next();
  });
};
