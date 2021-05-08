import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreModule } from '../score/score.module';
import { SeasonController } from './season.controller';
import { SeasonRepository } from './season.repository';
import { SeasonService } from './season.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeasonRepository]),
    forwardRef(() => ScoreModule),
  ],
  providers: [SeasonService],
  controllers: [SeasonController],
  exports: [SeasonService],
})
export class SeasonModule {}
