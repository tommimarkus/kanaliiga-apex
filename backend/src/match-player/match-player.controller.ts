import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { ApiBasicAuth } from '@nestjs/swagger'
import { Role } from '../auth/role.constant'
import { Roles } from '../auth/role.decorator'
import { type MatchResultTeamMemberOutputData } from '../match/match-output.interface'
import { MatchPlayerService } from './match-player.service'

@ApiBasicAuth()
@Controller('player')
export class MatchPlayerController {
  constructor (private readonly matchPlayerService: MatchPlayerService) {}

  @Get()
  @Roles(Role.ADMIN)
  async list (): Promise<MatchResultTeamMemberOutputData[]> {
    return await this.matchPlayerService.find()
  }

  @Get(':matchId/mvp/kills/:limit')
  @Roles(Role.USER, Role.ADMIN)
  async findTopKillsByMatchId (@Param('matchId', ParseIntPipe) matchId: number, @Param('limit', ParseIntPipe) limit: number): Promise<MatchResultTeamMemberOutputData[]> {
    return await this.matchPlayerService.findTopKillsByMatchId(matchId, limit)
  }

  @Get(':matchId/mvp/damage/:limit')
  @Roles(Role.USER, Role.ADMIN)
  async findTopDamageByMatchId (@Param('matchId', ParseIntPipe) matchId: number, @Param('limit', ParseIntPipe) limit: number): Promise<MatchResultTeamMemberOutputData[]> {
    return await this.matchPlayerService.findTopDamageByMatchId(matchId, limit)
  }

  @Get(':matchId/mvp/assists/:limit')
  @Roles(Role.USER, Role.ADMIN)
  async findTopAssistsByMatchId (@Param('matchId', ParseIntPipe) matchId: number, @Param('limit', ParseIntPipe) limit: number): Promise<MatchResultTeamMemberOutputData[]> {
    return await this.matchPlayerService.findTopAssistsByMatchId(matchId, limit)
  }
}
