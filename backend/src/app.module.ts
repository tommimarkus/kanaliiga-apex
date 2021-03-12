import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';

@Module({
  imports: [TypeOrmModule.forRoot(), MatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
