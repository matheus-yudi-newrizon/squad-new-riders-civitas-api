import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/User';

export class CreateAdmin1728878974888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const email: string = 'admin@exemplo.com';

    const admin: User = new User();
    admin.email = email;
    admin.accessLevel = 'admin';
    admin.accountType = 'free';

    await queryRunner.manager.save(admin);

    console.log(`Administrador criado com sucesso!. Senha: ${admin.rawPassword}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: 'admin@exemplo.com' });
  }
}
