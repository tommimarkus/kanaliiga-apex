import { Controller, Get } from '@nestjs/common';
import { ApiBasicAuth } from '@nestjs/swagger';
import { Role } from '../auth/role.constant';
import { Roles } from '../auth/role.decorator';
import { MatchResultTeamMemberOutputData } from '../match/match-output.interface';
import { MatchPlayerService } from './match-player.service';

@ApiBasicAuth()
@Controller('player')
export class MatchPlayerController {
  constructor(private readonly matchPlayerService: MatchPlayerService) {}

  @Get()
  @Roles(Role.ADMIN)
  async list(): Promise<MatchResultTeamMemberOutputData[]> {
    // const matchPlayerEntities = await this.matchPlayerService.find();
    // return matchPlayerEntities.map(
    //   matchPlayerEntity =>
    //     new MatchResultTeamMemberOutputData(matchPlayerEntity),
    // );
    return await this.matchPlayerService.find();
  }
}
