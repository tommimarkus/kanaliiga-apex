import { Injectable, Logger, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import typeormConfig from '../config/config.typeorm'

@Injectable()
class ClearDatabaseService {
  constructor (private readonly connection: Connection) {}

  async clearMatch (): Promise<void> {
    Logger.log('Clearing Match')
    await this.connection
      .createQueryRunner()
      .query(
        'TRUNCATE "match-player", "match", "group", "tournament", "season" RESTART IDENTITY CASCADE;'
      )
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeormConfig()
    })
  ],
  providers: [ClearDatabaseService]
})
class ClearDatabaseModule {}

async function bootstrap (): Promise<void> {
  try {
    const app = await NestFactory.createApplicationContext(
      ClearDatabaseModule,
      {
        abortOnError: true
      }
    )
    try {
      Logger.log('Clearing database:')
      const clearDatabaseService = app.get(ClearDatabaseService)
      await clearDatabaseService.clearMatch()
    } catch (exception) {
      Logger.error(exception)
      if (exception.stackTrace != null) {
        Logger.error(exception.stackTrace)
      }
    }
    await app.close()
  } catch (exception) {
    Logger.error(exception)
    if (exception.stackTrace != null) {
      Logger.error(exception.stackTrace)
    }
  }
}

bootstrap().catch((reason: any) => { Logger.error(reason) })
