import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class JwtService {
  private static readonly secretPass: string = process.env.JWT_PASS;
  private static readonly tokenExpiration: string = '1h';

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
   * Verifica se o token JWT fornecido é válido de forma assíncrona.
   *
   * @param token - O token JWT que precisa ser verificado.
   * @param callback - Função de callback para lidar com o resultado da verificação (erro ou payload).
   */
  public verifyToken(token: string, callback: (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => void): void {
    jwt.verify(token, JwtService.secretPass, (err, decoded) => {
      if (err) {
        return callback(err, undefined);
      }
      return callback(null, decoded);
    });
  }
}
