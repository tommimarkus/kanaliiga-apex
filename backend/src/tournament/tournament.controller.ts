import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import {
  TournamentInputData,
  TournamentOutputData,
} from './tournament.interface';
import { TournamentService } from './tournament.service';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get(':id')
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TournamentOutputData> | undefined {
    return await this.tournamentService.findOne(id);
  }

  @Post(':token')
  @ApiBody({ type: TournamentInputData })
  async save(
    @Param('token') token: string,
    @Body() body: TournamentInputData,
  ): Promise<TournamentOutputData> | undefined {
    Logger.log(`save ${token}: ${JSON.stringify(body, null, 2)}`);
    return await this.tournamentService.save(token, body);
  }
}
