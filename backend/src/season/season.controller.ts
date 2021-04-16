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
import { Role } from '../auth/role.constant';
import { Roles } from '../auth/role.decorator';
import { SeasonInputData } from './season-input.interface';
import {
  SeasonOutputOneData,
  SeasonOutputListData,
} from './season-output.interface';
import { SeasonService } from './season.service';

@ApiBasicAuth()
@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  async list(): Promise<SeasonOutputListData[]> {
    const seasonEntities = await this.seasonService.find();
    return seasonEntities.map(
      seasonEntity => new SeasonOutputListData(seasonEntity),
    );
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBody({ type: SeasonInputData })
  async save(
    @Body() body: SeasonInputData,
  ): Promise<SeasonOutputOneData> | undefined {
    Logger.log(`save: ${JSON.stringify(body, null, 2)}`);

    const savedSeasonEntity = await this.seasonService.save(body);
    return savedSeasonEntity
      ? new SeasonOutputOneData(savedSeasonEntity)
      : undefined;
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SeasonOutputOneData> | undefined {
    const seasonEntity = await this.seasonService.findOne(id);
    return seasonEntity ? new SeasonOutputOneData(seasonEntity) : undefined;
  }
}
