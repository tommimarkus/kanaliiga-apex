import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonController } from './season.controller';
import { SeasonRepository } from './season.repository';
import { SeasonService } from './season.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonRepository])],
  providers: [SeasonService],
  controllers: [SeasonController],
  exports: [SeasonService],
})
export class SeasonModule {}
