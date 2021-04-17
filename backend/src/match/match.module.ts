import { forwardRef, Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MatchRepository } from './match.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchRepository]),
    forwardRef(() => GroupModule),
  ],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
