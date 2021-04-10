import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { formatISO } from 'date-fns';
import { TournamentOutputOneData } from '../tournament/tournament.interface';
import { IsISO8601 } from 'class-validator';

// INPUT

export class SeasonData {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: formatISO(new Date()),
    required: false,
    nullable: true,
  })
  @IsISO8601({ strict: true })
  start?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: formatISO(new Date()),
    required: false,
    nullable: true,
  })
  @IsISO8601({ strict: true })
  end?: string;

  @ApiProperty({
    example: 'Kanaliiga Apex S2',
    required: true,
    nullable: false,
  })
  name: string;
}

export class SeasonInputData extends SeasonData {}

// OUTPUT

export class SeasonOutputData extends SeasonData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  active: boolean;
}

export class SeasonOutputOneData extends SeasonOutputData {
  @ApiProperty({ type: [TournamentOutputOneData] })
  tournaments: TournamentOutputOneData[];
}

export class SeasonOutputListData extends SeasonOutputData {}
