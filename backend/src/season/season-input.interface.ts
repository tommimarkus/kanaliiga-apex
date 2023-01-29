import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath
} from '@nestjs/swagger'
import { formatISO } from 'date-fns'
import { IsISO8601 } from 'class-validator'
import { type SeasonEntity } from './season.entity'
import { ScoreInputData } from '../score/score-input.interface'

export class SeasonData {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    nullable: true,
    example: formatISO(new Date())
  })
  @IsISO8601({ strict: true })
    start?: string

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    nullable: true,
    example: formatISO(new Date())
  })
  @IsISO8601({ strict: true })
    end?: string

  @ApiProperty({
    nullable: false,
    example: 'Kanaliiga Apex S2'
  })
    name: string

  constructor (entity?: SeasonEntity) {
    if (entity != null) {
      this.start = formatISO(entity.start)
      this.end = formatISO(entity.end)
      this.name = entity.name
    }
  }
}

export class SeasonInputData extends SeasonData {
  @ApiProperty({
    anyOf: [
      { type: 'number', example: 1 },
      { $ref: getSchemaPath(ScoreInputData) }
    ]
  })
    score: number | ScoreInputData
}
