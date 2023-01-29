import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeasonModule } from '../season/season.module'
import { TournamentController } from './tournament.controller'
import { TournamentEntity } from './tournament.entity'
import { TournamentService } from './tournament.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([TournamentEntity]),
    forwardRef(() => SeasonModule)
  ],
  providers: [TournamentService],
  controllers: [TournamentController],
  exports: [TournamentService]
})
export class TournamentModule {}
