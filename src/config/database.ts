import { DataSource } from 'typeorm';

export const MysqlDataSource = new DataSource({
  name: 'default',
  type: 'mysql',
  database: process.env.DB_DATABASE,
  url: process.env.DB_CONNECTION_STRING,
  entities: ['src/entities/*.ts', 'entities/*.js'],
  logging: true,
  synchronize: true,
  migrations: ['src/migrations/*.ts'],
  migrationsRun: true
});
