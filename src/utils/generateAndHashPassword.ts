import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Gera uma senha aleatória de 8 dígitos e retorna a senha original e sua versão hasheada utilizando bcrypt.
 *
 * @returns {Promise<{ rawPassword: string; hashedPassword: string }>}
 *          Um objeto contendo a senha gerada (`rawPassword`) e sua versão hasheada (`hashedPassword`),
 *          que pode ser armazenada de forma segura no banco de dados.
 *
 * @remarks
 * A função usa `randomBytes` para gerar 8 bytes aleatórios, convertidos em dígitos numéricos (0-9) usando o operador `% 10`.
 * O `bcrypt` aplica 10 rounds de salt para gerar o hash da senha, garantindo que ela seja armazenada de forma segura.
 *
 * @example
 * const { rawPassword, hashedPassword } = await generateAndHashPassword();
 * console.log('Senha gerada:', rawPassword); // Exibe a senha original
 * console.log('Senha hasheada:', hashedPassword); // Exibe a senha hasheada para armazenamento
 */
export const generateAndHashPassword = async (): Promise<{
  rawPassword: string;
  hashedPassword: string;
}> => {
  const rawPassword = Array.from(randomBytes(8))
    .map(byte => (byte % 10).toString())
    .join('');

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  return { rawPassword, hashedPassword };
};
