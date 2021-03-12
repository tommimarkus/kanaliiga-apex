import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { MatchEntity } from './match.entity';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':token')
  async find(@Param('token') token: string): Promise<MatchOutputData> | undefined {
    return await this.matchService.findOne(token);
  }

  @Post(':token')
  async save(
    @Param('token') token: string,
    @Body() body: EAMatchesData,
  ): Promise<MatchOutputData[]> | undefined {
    Logger.log(`save ${token}: ${JSON.stringify(body, null, 2)}`);
    return await this.matchService.save(token, body);
  }
}
