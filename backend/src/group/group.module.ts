import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TournamentModule } from '../tournament/tournament.module'
import { GroupController } from './group.controller'
import { GroupEntity } from './group.entity'
import { GroupService } from './group.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    forwardRef(() => TournamentModule)
  ],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService]
})
export class GroupModule {}
