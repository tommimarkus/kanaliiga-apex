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
import {
  TournamentInputCSVData,
  TournamentInputData,
  TournamentOutputData,
  TournamentOutputListData,
} from './tournament.interface';
import { TournamentService } from './tournament.service';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  async list(): Promise<TournamentOutputListData[]> {
    return await this.tournamentService.find();
  }

  @Get(':id')
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TournamentOutputData> | undefined {
    return await this.tournamentService.findOne(id);
  }

  @Post('csv')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) =>
        callback(null, file.originalname.match(/\.(csv)$/) !== null),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TournamentInputCSVData })
  async saveCSV(
    @Body() body: TournamentInputCSVData,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TournamentOutputData> | undefined {
    Logger.log(
      `save csv ${file.originalname}: ${JSON.stringify(body, null, 2)}`,
    );
    return await this.tournamentService.saveCSV(file, body);
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
