import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsISO8601 } from 'class-validator'
import { formatISO } from 'date-fns'
import { type MatchEntity } from './match.entity'

export class MatchData {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    nullable: true,
    example: formatISO(new Date())
  })
  @IsISO8601({ strict: true })
    start?: string

  @ApiPropertyOptional({ nullable: true, example: false })
    aimAssistAllowed?: boolean

  @ApiPropertyOptional({ nullable: true, example: 'mp_rr_desertlands_mu3' })
    mapName?: string

  constructor (entity?: MatchEntity) {
    if (entity != null) {
      this.start = (entity.start != null) ? formatISO(entity.start) : undefined
      this.aimAssistAllowed = entity.aimAssistAllowed
      this.mapName = entity.mapName
    }
  }
}

export class MatchInputJSONData {
  @ApiProperty({
    nullable: false,
    example: '0e711786-4b4949ed8d7736c07a01d1'
  })
    token: string

  @ApiPropertyOptional({ nullable: true, example: 1 })
    group?: number

  @ApiProperty({ type: 'file', nullable: false })
    file: Express.Multer.File
}
