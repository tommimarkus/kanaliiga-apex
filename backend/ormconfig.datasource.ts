import { connectionOptions } from 'src/config/config.connection'
import { DataSource } from 'typeorm'

export const MigrationsSource = new DataSource(connectionOptions())
