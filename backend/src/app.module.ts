import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer = require('multer');
import { CsvModule } from 'nest-csv-parser';
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';
import { TournamentModule } from './tournament/tournament.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import typeormConfig from './config/config.typeorm';
import { APP_GUARD } from '@nestjs/core';
import { BasicAuthGuard } from './auth/basic-auth.guard';

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
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BasicAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
