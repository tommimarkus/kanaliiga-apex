import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MatchPlayerController } from './match-player.controller'
import { MatchPlayerEntity } from './match-player.entity'
import { MatchPlayerService } from './match-player.service'

@Module({
  imports: [TypeOrmModule.forFeature([MatchPlayerEntity])],
  providers: [MatchPlayerService],
  controllers: [MatchPlayerController],
  exports: [MatchPlayerService]
})
export class MatchPlayerModule {}
