/**
 * Interface que estende o objeto Request do Express para incluir informações do payload JWT e, opcionalmente, o ID da escola.
 *
 * @interface IAuthJWTRequest
 * @extends {Request}
 *
 * @property {JwtPayload} token - O payload JWT extraído da requisição, contendo informações do usuário autenticado.
 * @property {string} [schoolId] - O identificador da escola associado ao usuário, extraído do token JWT, podendo estar ausente.
 */
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IAuthJWTRequest extends Request {
  token: JwtPayload;
  schoolId?: string;
}
