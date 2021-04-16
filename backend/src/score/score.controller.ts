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
import { ScoreInputData } from './score-input.interface';
import {
  ScoreOutputListData,
  ScoreOutputOneData,
} from './score-output.interface';
import { ScoreService } from './score.service';

@ApiBasicAuth()
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  @Roles(Role.ADMIN)
  async list(): Promise<ScoreOutputListData[]> {
    const scoreEntities = await this.scoreService.find();
    return scoreEntities.map(
      scoreEntity => new ScoreOutputListData(scoreEntity),
    );
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBody({ type: ScoreInputData })
  async save(
    @Body() body: ScoreInputData,
  ): Promise<ScoreOutputOneData> | undefined {
    Logger.log(`save: ${JSON.stringify(body, null, 2)}`);
    const savedScoreEntity = await this.scoreService.save(body);
    return savedScoreEntity
      ? new ScoreOutputOneData(savedScoreEntity)
      : undefined;
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ScoreOutputOneData> | undefined {
    const scoreEntity = await this.scoreService.findOne(id);
    return scoreEntity ? new ScoreOutputOneData(scoreEntity) : undefined;
  }
}
