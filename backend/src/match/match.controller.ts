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
import { EAMatchesData } from '../ea-match-data/ea-match-data.interface';
import { MatchOutputData } from './match.interface';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':id')
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MatchOutputData> | undefined {
    return await this.matchService.findOne(id);
  }

  @Post(':token')
  @ApiBody({ type: EAMatchesData })
  async save(
    @Param('token') token: string,
    @Body() body: EAMatchesData,
  ): Promise<MatchOutputData[]> | undefined {
    Logger.log(`save ${token}: ${JSON.stringify(body, null, 2)}`);
    return await this.matchService.save(token, body);
  }
}
