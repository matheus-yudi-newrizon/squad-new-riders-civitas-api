import { MigrationInterface, QueryRunner } from 'typeorm';
import { Admin } from '../entities/Admin';
import { generateAndHashPassword } from '../services/AdminPasswordService';

export class CreateAdmin1728790156765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { rawPassword, hashedPassword } = await generateAndHashPassword();

    const admin = new Admin();
    admin.email = 'exemploo@exemplo.com';
    admin.password = hashedPassword;
    admin.accessLevel = 'admin';
    admin.accountType = 'free';

    const existingAdmin = await queryRunner.manager.findOne(Admin, {
      where: { email: admin.email }
    });
    if (existingAdmin) {
      console.log('Já existe um administrador vinculado à este email.');
      return;
    }

    await queryRunner.manager.save(admin);

    console.log(`Administrador criado com sucesso! Senha: ${rawPassword}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Admin, { email: 'exemplo@exemplo.com' });
  }
}
