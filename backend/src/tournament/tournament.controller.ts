import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post
} from '@nestjs/common'
import { ApiBasicAuth, ApiBody } from '@nestjs/swagger'
import { Role } from '../auth/role.constant'
import { Roles } from '../auth/role.decorator'
import { TournamentInputData } from './tournament-input.interface'
import {
  TournamentOutputOneData,
  TournamentOutputListData
} from './tournament-output.interface'
import { TournamentService } from './tournament.service'

@ApiBasicAuth()
@Controller('tournament')
export class TournamentController {
  constructor (private readonly tournamentService: TournamentService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  async list (): Promise<TournamentOutputListData[]> {
    const tournamentEntities = await this.tournamentService.find()
    return tournamentEntities.map(
      tournamentEntity => new TournamentOutputListData(tournamentEntity)
    )
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async find (
    @Param('id', ParseIntPipe) id: number
  ): Promise<TournamentOutputOneData | undefined> {
    const tournamentEntity = await this.tournamentService.findOne(id)
    return (tournamentEntity != null)
      ? new TournamentOutputOneData(tournamentEntity)
      : undefined
  }

  @Post(':token')
  @Roles(Role.ADMIN)
  @ApiBody({ type: TournamentInputData })
  async save (
    @Param('token') token: string,
      @Body() body: TournamentInputData
  ): Promise<TournamentOutputOneData | undefined> {
    Logger.log(`save ${token}: ${JSON.stringify(body, null, 2)}`)

    const savedTournamentEntity = await this.tournamentService.save(
      token,
      body
    )
    return (savedTournamentEntity != null)
      ? new TournamentOutputOneData(savedTournamentEntity)
      : undefined
  }
}
