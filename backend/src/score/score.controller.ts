import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Logger,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody } from '@nestjs/swagger';
import { Role } from '../auth/role.constant';
import { Roles } from '../auth/role.decorator';
import { SeasonInputData } from '../season/season.interface';
import {
  ScoreOutputListData,
  ScoreOutputOneData,
  ScoreInputData,
} from './score.interface';
import { ScoreService } from './score.service';

@ApiBasicAuth()
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  async list(): Promise<ScoreOutputListData[]> {
    return await this.scoreService.find();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ScoreOutputOneData> | undefined {
    return await this.scoreService.findOne(id);
  }

  @Post('new')
  @Roles(Role.ADMIN)
  @ApiBody({ type: SeasonInputData })
  async save(
    @Body() body: ScoreInputData,
  ): Promise<ScoreOutputOneData> | undefined {
    Logger.log(`save: ${JSON.stringify(body, null, 2)}`);
    return await this.scoreService.save(body);
  }
}
