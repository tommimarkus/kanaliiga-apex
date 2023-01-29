import { config } from 'dotenv'
import { type LoggerOptions } from 'typeorm'
import { type PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

config()

export function connectionOptions (): PostgresConnectionOptions {
  const logging = (): LoggerOptions => {
    const loggingValue = process.env.TYPEORM_LOGGING
    if (loggingValue != null) {
      try {
        return JSON.parse(loggingValue)
      } catch (e) {
        return loggingValue === 'all' ? loggingValue : loggingValue === 'true'
      }
    }
    return false
  }
  return {
    type: 'postgres',
    host: process.env.TYPEORM_HOST ?? 'localhost',
    port: Number(process.env.TYPEORM_PORT) ?? 5432,
    username: process.env.TYPEORM_USERNAME ?? 'kanaliiga-apex-dev',
    password: process.env.TYPEORM_PASSWORD ?? 'kanaliiga-apex-dev',
    database: process.env.TYPEORM_DATABASE ?? 'kanaliiga-apex-dev',
    entities: JSON.parse(process.env.TYPEORM_ENTITIES ?? '[]'),
    migrations: JSON.parse(process.env.TYPEORM_MIGRATIONS ?? '[]'),
    migrationsRun: (process.env.TYPEORM_MIGRATIONS_RUN ?? 'false').toLowerCase() === 'true',
    logging: logging(),
    dropSchema: (process.env.TYPEORM_DROP_SCHEMA ?? 'false').toLowerCase() === 'true',
    synchronize: (process.env.TYPEORM_SYNCHRONIZE ?? 'false').toLowerCase() === 'true'
  }
}
