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
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { TournamentInputCSVData, TournamentOutputData } from 'src/tournament/tournament.interface';
import { EAMatchesData } from '../ea-match-data/ea-match-data.interface';
import { MatchInputJSONData, MatchOutputData } from './match.interface';
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

  @Post('json')
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
  ): Promise<MatchOutputData[]> | undefined {
    Logger.log(
      `save json ${file.originalname}: ${JSON.stringify(body, null, 2)}`,
    );
    return await this.matchService.saveJSON(file, body.token);
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
