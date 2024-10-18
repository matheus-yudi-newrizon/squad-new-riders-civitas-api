import jwt, { JwtPayload } from 'jsonwebtoken';
import { Service } from 'typedi';
import { InvalidJWTTokenError } from '../utils/apiErrors';

@Service()
export class JwtService {
  private static readonly secretPass: string = process.env.JWT_PASS;
  private static readonly tokenExpiration: string = '2h';
  /**
   * Gera um token JWT com os dados do payload.
   *
   * @param payload - Os dados que serão incluídos no token.
   * @returns Um token JWT assinado.
   */
  public generateToken(payload: object): string {
    return jwt.sign(payload, JwtService.secretPass, { expiresIn: JwtService.tokenExpiration });
  }

  /**
   * Verifica se o token JWT fornecido é válido.
   *
   * @param token - O token JWT que precisa ser verificado.
   * @returns O payload decodificado se o token for válido.
   * @throws {InvalidJWTTokenError} Se o token for inválido ou expirado.
   */
  public verifyToken(token: string): string | JwtPayload {
    const decoded: string | JwtPayload = jwt.verify(token, JwtService.secretPass);
    if (!decoded) {
      throw new InvalidJWTTokenError('Token inválido ou expirado');
    }
    return decoded;
  }
}
