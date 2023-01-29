import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { formatISO } from 'date-fns'
import { IsISO8601 } from 'class-validator'
import { type TournamentEntity } from './tournament.entity'

export class TournamentData {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    nullable: true,
    example: formatISO(new Date())
  })
  @IsISO8601({ strict: true })
    start?: string

  @ApiProperty({
    nullable: false,
    example: 'Kanaliiga Apex S2 Game Day 1'
  })
    name: string

  constructor (entity?: TournamentEntity) {
    if (entity != null) {
      this.start = formatISO(entity.start)
      this.name = entity.name
    }
  }
}

export class TournamentInputData extends TournamentData {
  @ApiProperty({ example: 1 })
    season?: number
}
