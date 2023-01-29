import { forwardRef, Module } from '@nestjs/common'
import { MatchService } from './match.service'
import { MatchController } from './match.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupModule } from '../group/group.module'
import { MatchPlayerModule } from '../match-player/match-player.module'
import { MatchEntity } from './match.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchEntity]),
    forwardRef(() => MatchPlayerModule),
    forwardRef(() => GroupModule)
  ],
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}
