import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScoreController } from './score.controller'
import { ScoreEntity } from './score.entity'
import { ScoreService } from './score.service'

@Module({
  imports: [TypeOrmModule.forFeature([ScoreEntity])],
  providers: [ScoreService],
  controllers: [ScoreController],
  exports: [ScoreService]
})
export class ScoreModule {}
