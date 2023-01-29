import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScoreModule } from '../score/score.module'
import { SeasonController } from './season.controller'
import { SeasonEntity } from './season.entity'
import { SeasonService } from './season.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([SeasonEntity]),
    forwardRef(() => ScoreModule)
  ],
  providers: [SeasonService],
  controllers: [SeasonController],
  exports: [SeasonService]
})
export class SeasonModule {}
