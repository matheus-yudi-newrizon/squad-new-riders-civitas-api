import { MigrationInterface, QueryRunner } from 'typeorm';
import { School } from '../entities/School';
import { User } from '../entities/User';

export class CreateAdmin1730178021740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const school = await queryRunner.manager.findOne(School, { where: { name: 'Escola exemplo' } });

    const email = 'email@example.com';
    const admin = new User();
    admin.email = email;
    admin.school = school;

    await queryRunner.manager.save(admin);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: 'admin@example.com' });
  }
}
