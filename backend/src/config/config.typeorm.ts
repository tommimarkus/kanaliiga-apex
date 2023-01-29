import { Logger } from '@nestjs/common'
import { registerAs } from '@nestjs/config'
import { type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { connectionOptions } from './config.connection'

export default registerAs(
  'typeOrmConfig',
  (): TypeOrmModuleOptions => {
    const typeOrmModuleOptions: TypeOrmModuleOptions = {
      ...connectionOptions()
    }
    Logger.log(JSON.stringify(typeOrmModuleOptions, null, 2))
    return typeOrmModuleOptions
  }
)
