import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';
import { formatISO } from 'date-fns';

// INPUT

export class MatchData {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: formatISO(new Date()),
    required: false,
    nullable: true,
  })
  @IsISO8601({ strict: true })
  start?: string;
}

export class MatchInputJSONData {
  @ApiProperty({ required: true, nullable: false })
  token: string;

  @ApiProperty({ type: 'file', required: true, nullable: false })
  file: Express.Multer.File;
}

// OUTPUT

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

export class MatchOutputData extends MatchData {
  @ApiProperty()
  results: MatchResultOutputData[];
}

export class MatchOutputListData extends MatchData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tournamentName?: string;
}
