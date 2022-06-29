import { forwardRef, Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MatchRepository } from './match.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from '../group/group.module';
import { MatchPlayerModule } from '../match-player/match-player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchRepository]),
    forwardRef(() => MatchPlayerModule),
    forwardRef(() => GroupModule),
  ],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
