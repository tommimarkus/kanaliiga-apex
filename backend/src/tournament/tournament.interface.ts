import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { formatISO } from 'date-fns';
import { MatchOutputData } from '../match/match.interface';
import { IsISO8601 } from 'class-validator';

// INPUT

export class TournamentData {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: formatISO(new Date()),
    required: false,
    nullable: true,
  })
  @IsISO8601({ strict: true })
  start?: string;

  @ApiProperty({
    example: 'Kanaliiga Apex #1 Game Day 1',
    required: true,
    nullable: false,
  })
  name: string;
}

export class TournamentInputData extends TournamentData {
  @ApiProperty({ required: true, nullable: false })
  matchTokens: string[];
}

export class TournamentInputCSVData extends TournamentData {
  @ApiProperty({ type: 'file', required: true, nullable: false })
  file: Express.Multer.File;
}

export class TournamentCSVData {
  @ApiProperty({ required: true, nullable: false })
  token: string;

  @ApiProperty({ required: true, nullable: false })
  activation: string;

  @ApiProperty({ required: true, nullable: false })
  expiration: string;

  @ApiProperty({ required: true, nullable: false })
  matchToken: string;
}

// OUTPUT

export class TournamentOutputData extends TournamentData {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [MatchOutputData] })
  matches: MatchOutputData[];
}

export class TournamentOutputListData extends TournamentData {
  @ApiProperty()
  id: number;
}
