import path from 'node:path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { envConfig } from '@/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envConfig.db.host,
  port: envConfig.db.port,
  username: envConfig.db.username,
  password: envConfig.db.password,
  database: envConfig.db.database,
  logging: envConfig.app.isDev ? true : ['error', 'warn', 'migration'],
  namingStrategy: new SnakeNamingStrategy(),
  entities: [path.join(__dirname, './entities/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  migrationsRun: envConfig.app.isProd,
  synchronize: false,
});
