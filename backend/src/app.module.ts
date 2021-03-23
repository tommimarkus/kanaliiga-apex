import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import multer = require('multer');
import { CsvModule } from 'nest-csv-parser';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get('TYPEORM_HOST', 'localhost'),
        port: config.get<number>('TYPEORM_PORT', 5432),
        username: config.get('TYPEORM_USERNAME', 'test'),
        password: config.get('TYPEORM_PASSWORD', 'test'),
        database: config.get('TYPEORM_DATABASE', 'test'),
        entities: JSON.parse(config.get('TYPEORM_ENTITIES', '[]')),
        migrations: JSON.parse(config.get('TYPEORM_MIGRATIONS', '[]')),
        migrationsRun: config.get('TYPEORM_MIGRATIONS_RUN', false),
        logging: config.get('TYPEORM_LOGGING', false),
        dropSchema: config.get('TYPEORM_DROP_SCHEMA', false),
        synchronize: config.get('TYPEORM_SYNCHRONIZE', false),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    MatchModule,
    TournamentModule,
    MulterModule.register({
      storage: multer.diskStorage({
        destination: '/tmp/kanaliiga-apex-uploads',
      }),
    }),
    CsvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
