import { MigrationInterface, QueryRunner } from 'typeorm';
import { School } from '../entities';

export class CreateSchool1730177132877 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [schoolName, address] = ['Escola New Riders', 'Rua dos Alfeneiros'];
    const school = new School();
    school.name = schoolName;
    school.address = address;

    await queryRunner.manager.save(school);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(School, { name: 'Escola New Riders' });
  }
}
