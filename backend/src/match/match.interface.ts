import { ApiProperty } from '@nestjs/swagger';

export class MatchInputJSONData {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: 'file' })
  file: Express.Multer.File;
}

export class MatchResultTeamMemberOutputData {
  @ApiProperty()
  name: string;

  @ApiProperty()
  kills: number;

  @ApiProperty()
  assists: number;

  @ApiProperty()
  damage: number;

  @ApiProperty()
  survivalTime: number;
}

export class MatchResultOutputData {
  @ApiProperty()
  teamNum: number;

  @ApiProperty()
  teamName: string;

  @ApiProperty()
  teamPlacement: number;

  @ApiProperty()
  teamKills: number;

  @ApiProperty()
  teamPoints: number;

  @ApiProperty()
  teamMembers: MatchResultTeamMemberOutputData[];

  @ApiProperty()
  teamDamage: number;
}

export class MatchOutputData {
  @ApiProperty()
  start: string;

  @ApiProperty()
  results: MatchResultOutputData[];
}
