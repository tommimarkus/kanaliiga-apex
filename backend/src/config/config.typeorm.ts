import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as setConfig } from 'dotenv';

setConfig();

export default registerAs(
  'typeOrmConfig',
  (): TypeOrmModuleOptions => {
    const config: TypeOrmModuleOptions = {
      type: 'postgres',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: Number(process.env.TYPEORM_PORT) || 5432,
      username: process.env.TYPEORM_USERNAME || 'test',
      password: process.env.TYPEORM_PASSWORD || 'test',
      database: process.env.TYPEORM_DATABASE || 'test',
      entities: JSON.parse(process.env.TYPEORM_ENTITIES || '[]'),
      migrations: JSON.parse(process.env.TYPEORM_MIGRATIONS || '[]'),
      migrationsRun:
        Boolean(JSON.parse(process.env.TYPEORM_MIGRATIONS_RUN)) || false,
      logging: Boolean(JSON.parse(process.env.TYPEORM_LOGGING)) || false,
      dropSchema: Boolean(JSON.parse(process.env.TYPEORM_DROP_SCHEMA)) || false,
      synchronize:
        Boolean(JSON.parse(process.env.TYPEORM_SYNCHRONIZE)) || false,
      cli: {
        migrationsDir: process.env.TYPEORM_CLI_MIGRATIONSDIR || 'migration',
      },
    };

    Logger.log(JSON.stringify(config, null, 2));

    return config;
  },
);
