import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer = require('multer');
import { CsvModule } from 'nest-csv-parser';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';
import { TournamentModule } from './tournament/tournament.module';
import typeormConfig from './config/config.typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', load: [typeormConfig] }),
    TypeOrmModule.forRoot(typeormConfig()),
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
