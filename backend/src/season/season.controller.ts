import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody } from '@nestjs/swagger';
import {
  SeasonInputData,
  SeasonOutputData,
  SeasonOutputListData,
} from './season.interface';
import { SeasonService } from './season.service';

@ApiBasicAuth()
@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Get()
  async list(): Promise<SeasonOutputListData[]> {
    return await this.seasonService.find();
  }

  @Get(':id')
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SeasonOutputData> | undefined {
    return await this.seasonService.findOne(id);
  }

  @Post('new')
  @ApiBody({ type: SeasonInputData })
  async save(
    @Body() body: SeasonInputData,
  ): Promise<SeasonOutputData> | undefined {
    Logger.log(`save: ${JSON.stringify(body, null, 2)}`);
    return await this.seasonService.save(body);
  }
}
