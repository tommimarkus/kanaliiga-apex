import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { formatISO } from 'date-fns';
import { MatchOutputOneData } from '../match/match.interface';
import { IsISO8601 } from 'class-validator';
import { SeasonOutputData } from '../season/season.interface';

// INPUT

export class GroupData {
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

export class GroupInputData extends GroupData {
  @ApiProperty({ required: true, nullable: false })
  matchTokens: string[];
}

// OUTPUT

export class GroupOutputData extends GroupData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  season?: SeasonOutputData;
}

export class GroupOutputOneData extends GroupOutputData {
  @ApiProperty({ type: [MatchOutputOneData] })
  matches: MatchOutputOneData[];
}

export class GroupOutputListData extends GroupOutputData {}
