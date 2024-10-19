/**
 * Interface que estende o objeto Request do Express para incluir um payload JWT.
 *
 * @interface IAuthJWTRequest
 * @extends {Request}
 *
 * @property {JwtPayload} token - O payload JWT extraído da requisição.
 */
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IAuthJWTRequest extends Request {
  token: JwtPayload;
}
