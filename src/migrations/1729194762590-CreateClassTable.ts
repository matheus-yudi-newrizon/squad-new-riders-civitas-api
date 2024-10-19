/*
import { MigrationInterface, QueryRunner } from 'typeorm';

/*
 * Migração responsável pela criação da tabela `class` no banco de dados.
 *
 * Esta migração cria a tabela `class` e define as colunas nome, anoLetivo,
 * periodoLetivo e ensino como enums.
 * /
export class CreateClassTable1729194762590 implements MigrationInterface {
  /*
   * Executa a migração criando a tabela `class`.
   *
   * A tabela contém as seguintes colunas:
   * - `id`: Identificador único (auto incrementado).
   * - `nome`: Nome da turma.
   * - `anoLetivo`: Enum representando o ano letivo.
   * - `periodoLetivo`: Enum representando o período letivo.
   * - `ensino`: Enum representando o tipo de ensino.
   *
   * @param queryRunner - QueryRunner para executar comandos SQL.
   * /
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE class (
                id INT AUTO_INCREMENT NOT NULL,
                nome VARCHAR(255) NOT NULL,
                anoLetivo ENUM('1st year', '2nd year', '3rd year', '4th year', '5th year', '6th year') NOT NULL,
                periodoLetivo ENUM('Morning', 'Afternoon', 'Night') NOT NULL,
                ensino ENUM('Nursery', 'Preschool', 'Elementary school 1') NOT NULL,
                PRIMARY KEY(id)
            ) ENGINE=InnoDB;
        `);
  }

  /*
   * Reverte a criação da tabela `class`, removendo-a do banco de dados.
   *
   * @param queryRunner - QueryRunner para executar comandos SQL.
   * /
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE class;`);
  }
}
*/
