import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer = require('multer');
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';
import { TournamentModule } from './tournament/tournament.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import typeormConfig from './config/config.typeorm';
import { APP_GUARD } from '@nestjs/core';
import { BasicAuthGuard } from './auth/basic-auth.guard';
import { SeasonModule } from './season/season.module';
import { RolesGuard } from './auth/role.guard';
import { ScoreModule } from './score/score.module';
import { GroupModule } from './group/group.module';
import { MatchPlayerModule } from './match-player/match-player.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig()),
    MatchModule,
    GroupModule,
    TournamentModule,
    SeasonModule,
    MulterModule.register({
      storage: multer.diskStorage({
        destination: '/tmp/kanaliiga-apex-uploads',
      }),
    }),
    AuthModule,
    UserModule,
    ScoreModule,
    MatchPlayerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BasicAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
