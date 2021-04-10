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
import {
  TournamentInputCSVData,
  TournamentInputData,
  TournamentOutputOneData,
  TournamentOutputListData,
} from './tournament.interface';
import { TournamentService } from './tournament.service';

@ApiBasicAuth()
@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  async list(): Promise<TournamentOutputListData[]> {
    return await this.tournamentService.find();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TournamentOutputOneData> | undefined {
    return await this.tournamentService.findOne(id);
  }

  @Post('csv')
  @Roles(Role.ADMIN)
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
  ): Promise<TournamentOutputOneData> | undefined {
    Logger.log(
      `save csv ${file.originalname}: ${JSON.stringify(body, null, 2)}`,
    );
    return await this.tournamentService.saveCSV(file, body);
  }

  @Post(':token')
  @Roles(Role.ADMIN)
  @ApiBody({ type: TournamentInputData })
  async save(
    @Param('token') token: string,
    @Body() body: TournamentInputData,
  ): Promise<TournamentOutputOneData> | undefined {
    Logger.log(`save ${token}: ${JSON.stringify(body, null, 2)}`);
    return await this.tournamentService.save(token, body);
  }
}
