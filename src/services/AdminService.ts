import { MysqlDataSource } from '../config/database';
import { Admin } from '../entities/Admin';
import { generateAndHashPassword } from './AdminPasswordService';

export const createAdmin = async (
  email: string
): Promise<{ rawPassword: string }> => {
  const adminRepository = MysqlDataSource.getRepository(Admin);

  const existingAdmin = await adminRepository.findOne({ where: { email } });
  if (existingAdmin) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const { rawPassword, hashedPassword } = await generateAndHashPassword();

  const admin = adminRepository.create({
    email,
    password: hashedPassword,
    accessLevel: 'admin',
    accountType: 'free'
  });

  await adminRepository.save(admin);

  return { rawPassword };
};
