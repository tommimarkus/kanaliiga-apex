import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchPlayerController } from './match-player.controller';
import { MatchPlayerRepository } from './match-player.repository';
import { MatchPlayerService } from './match-player.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchPlayerRepository])],
  providers: [MatchPlayerService],
  controllers: [MatchPlayerController],
  exports: [MatchPlayerService],
})
export class MatchPlayerModule {}
