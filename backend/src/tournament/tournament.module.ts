import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreModule } from '../score/score.module';
import { SeasonModule } from '../season/season.module';
import { TournamentController } from './tournament.controller';
import { TournamentRepository } from './tournament.repository';
import { TournamentService } from './tournament.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TournamentRepository]),
    forwardRef(() => ScoreModule),
    forwardRef(() => SeasonModule),
  ],
  providers: [TournamentService],
  controllers: [TournamentController],
  exports: [TournamentService],
})
export class TournamentModule {}
