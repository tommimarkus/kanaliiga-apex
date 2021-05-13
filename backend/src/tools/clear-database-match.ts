import { Injectable, Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import typeormConfig from '../config/config.typeorm';

@Injectable()
class ClearDatabaseService {
  constructor(private connection: Connection) {}

  async clearMatch() {
    Logger.log('Clearing Match');
    await this.connection
      .createQueryRunner()
      .query(
        'TRUNCATE "match-player", "match", "group", "tournament", "season" RESTART IDENTITY CASCADE;',
      );
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeormConfig(),
    }),
  ],
  providers: [ClearDatabaseService],
})
class ClearDatabaseModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(
      ClearDatabaseModule,
      {
        abortOnError: true,
      },
    );
    try {
      Logger.log('Clearing database:');
      const clearDatabaseService = app.get(ClearDatabaseService);
      await clearDatabaseService.clearMatch();
    } catch (e) {
      Logger.error(`${e.name} ${e.message}`);
      if (e.stackTrace) {
        Logger.error(`${e.stackTrace}`);
      }
    }
    await app.close();
  } catch (e) {
    Logger.error(`${e.name} ${e.message}`);
    if (e.stackTrace) {
      Logger.error(`${e.stackTrace}`);
    }
  }
}

bootstrap();
