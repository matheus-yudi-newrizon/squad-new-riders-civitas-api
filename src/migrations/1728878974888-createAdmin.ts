import { MigrationInterface, QueryRunner } from 'typeorm';
import { Admin } from '../entities/Admin';
import { generateAndHashPassword } from '../services/AdminPasswordService';

export class CreateAdmin1728878974888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { rawPassword, hashedPassword } = await generateAndHashPassword();

    const admin: Admin = new Admin();
    admin.email = 'exemplo@exemplo.com';
    admin.password = hashedPassword;
    admin.accessLevel = 'admin';
    admin.accountType = 'free';

    const existingAdmin: Admin | null = await queryRunner.manager.findOne(
      Admin,
      {
        where: { email: admin.email }
      }
    );
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
