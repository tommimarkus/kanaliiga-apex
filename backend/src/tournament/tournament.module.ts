import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvModule } from 'nest-csv-parser';
import { TournamentController } from './tournament.controller';
import { TournamentRepository } from './tournament.repository';
import { TournamentService } from './tournament.service';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentRepository]), CsvModule],
  providers: [TournamentService],
  controllers: [TournamentController],
})
export class TournamentModule {}
