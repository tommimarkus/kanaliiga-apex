import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [TypeOrmModule.forRoot(), MatchModule, TournamentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
