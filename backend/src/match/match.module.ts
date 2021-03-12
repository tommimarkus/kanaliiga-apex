import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MatchRepository } from './match.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MatchRepository])],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
