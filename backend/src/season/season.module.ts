import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvModule } from 'nest-csv-parser';
import { SeasonController } from './season.controller';
import { SeasonRepository } from './season.repository';
import { SeasonService } from './season.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonRepository]), CsvModule],
  providers: [SeasonService],
  controllers: [SeasonController],
})
export class SeasonModule {}
