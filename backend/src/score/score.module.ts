import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreController } from './score.controller';
import { ScoreRepository } from './score.repository';
import { ScoreService } from './score.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreRepository])],
  providers: [ScoreService],
  controllers: [ScoreController],
  exports: [ScoreService],
})
export class ScoreModule {}
