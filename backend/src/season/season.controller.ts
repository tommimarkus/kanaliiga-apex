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
import {
  SeasonInputData,
  SeasonOutputOneData,
  SeasonOutputListData,
} from './season.interface';
import { SeasonService } from './season.service';

@ApiBasicAuth()
@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  async list(): Promise<SeasonOutputListData[]> {
    return await this.seasonService.find();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SeasonOutputOneData> | undefined {
    return await this.seasonService.findOne(id);
  }

  @Post('new')
  @Roles(Role.ADMIN)
  @ApiBody({ type: SeasonInputData })
  async save(
    @Body() body: SeasonInputData,
  ): Promise<SeasonOutputOneData> | undefined {
    Logger.log(`save: ${JSON.stringify(body, null, 2)}`);
    return await this.seasonService.save(body);
  }
}
