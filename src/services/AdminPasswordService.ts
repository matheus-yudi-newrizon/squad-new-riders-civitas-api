import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

export const generateAndHashPassword = async (): Promise<{
  rawPassword: string;
  hashedPassword: string;
}> => {
  const rawPassword = Array.from(randomBytes(8))
    .map((byte) => (byte % 10).toString())
    .join('');

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  return { rawPassword, hashedPassword };
};
