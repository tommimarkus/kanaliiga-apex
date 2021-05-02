import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBasicAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Role } from '../auth/role.constant';
import { Roles } from '../auth/role.decorator';
import { EAMatchesData } from '../ea-match-data/ea-match-data.interface';
import { MatchInputJSONData } from './match-input.interface';
import {
  MatchOutputOneData,
  MatchOutputListData,
} from './match-output.interface';
import { MatchService } from './match.service';

@ApiBasicAuth()
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  async list(): Promise<MatchOutputListData[]> {
    const matchEntities = await this.matchService.find();
    return matchEntities.map(
      matchEntity => new MatchOutputListData(matchEntity),
    );
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MatchOutputOneData> | undefined {
    Logger.log(`find ${id}`);

    const matchEntity = await this.matchService.findOne(id);
    return matchEntity ? new MatchOutputOneData(matchEntity) : undefined;
  }

  @Post('json')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) =>
        callback(null, file.originalname.match(/\.(json)$/) !== null),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MatchInputJSONData })
  async saveJSON(
    @Body() body: MatchInputJSONData,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MatchOutputOneData[]> | undefined {
    Logger.log(
      `save json ${file.originalname}: ${JSON.stringify(body, null, 2)}`,
    );

    const savedMatchEntities = await this.matchService.saveJSON(
      file,
      body.token,
      body.group,
    );
    return savedMatchEntities
      ? savedMatchEntities.map(
          matchEntity => new MatchOutputOneData(matchEntity),
        )
      : undefined;
  }

  @Post(':token')
  @Roles(Role.ADMIN)
  @ApiBody({ type: EAMatchesData })
  async save(
    @Param('token') token: string,
    @Body() body: EAMatchesData,
  ): Promise<MatchOutputOneData[]> | undefined {
    Logger.log(`save ${token}: ${JSON.stringify(body, null, 2)}`);

    const savedMatchEntities = await this.matchService.save(token, body);
    return savedMatchEntities
      ? savedMatchEntities.map(
          matchEntity => new MatchOutputOneData(matchEntity),
        )
      : undefined;
  }

  @Post(':token/:group')
  @Roles(Role.ADMIN)
  @ApiBody({ type: EAMatchesData })
  async saveWithGroup(
    @Param('token') token: string,
    @Param('group', ParseIntPipe) group: number,
    @Body() body: EAMatchesData,
  ): Promise<MatchOutputOneData[]> | undefined {
    Logger.log(`save ${token} ${group}: ${JSON.stringify(body, null, 2)}`);

    const savedMatchEntities = await this.matchService.save(token, body, group);
    return savedMatchEntities
      ? savedMatchEntities.map(
          matchEntity => new MatchOutputOneData(matchEntity),
        )
      : undefined;
  }
}
