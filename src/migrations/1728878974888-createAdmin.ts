import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/User';

export class CreateAdmin1728878974888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const email: string = 'admin@exemplo.com';

    /**
     * Recupera um usuário administrador existente do banco de dados com base no e-mail fornecido.
     *
     * @param queryRunner - A instância de QueryRunner usada para gerenciar a conexão com o banco de dados.
     * @param User - A entidade User na qual será feita a busca.
     * @param admin.email - O e-mail do usuário administrador que será pesquisado.
     * @returns Uma promessa que se resolve com o usuário administrador existente, se encontrado, ou null, se não for encontrado.
     */
    const existingAdmin: User | null = await queryRunner.manager.findOne(User, {
      where: { email }
    });
    if (existingAdmin) {
      console.log('Já existe um administrador vinculado à este email.');
      return;
    }

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
