import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { formatISO } from 'date-fns';
import { IsISO8601 } from 'class-validator';
import { TournamentEntity } from './tournament.entity';
import { GroupInputData } from '../group/group-input.interface';
import { ScoreInputData } from '../score/score-input.interface';

export class TournamentData {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    nullable: true,
    example: formatISO(new Date()),
  })
  @IsISO8601({ strict: true })
  start?: string;

  @ApiProperty({
    nullable: false,
    example: 'Kanaliiga Apex S2 Game Day 1',
  })
  name: string;

  constructor(entity?: TournamentEntity) {
    if (entity) {
      this.start = formatISO(entity.start);
      this.name = entity.name;
    }
  }
}

export class TournamentInputData extends TournamentData {
  @ApiProperty({ type: [GroupInputData] })
  groups: GroupInputData[];

  @ApiProperty({ example: 1 })
  season: number;

  @ApiProperty({
    anyOf: [
      { type: 'number', example: 1 },
      { $ref: getSchemaPath(ScoreInputData) },
    ],
  })
  score: number | ScoreInputData;
}
