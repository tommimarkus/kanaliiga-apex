import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { type ScoreEntity } from './score.entity'
import { ScoreData } from './score-input.interface'
import { SeasonOutputListData } from '../season/season-output.interface'

export class ScoreOutputData extends ScoreData {
  @ApiProperty()
    id: number

  constructor (entity?: ScoreEntity) {
    super(entity)

    if (entity != null) {
      this.id = entity.id
    }
  }
}

export class ScoreOutputOneData extends ScoreOutputData {
  @ApiPropertyOptional({ type: [SeasonOutputListData] })
    seasons?: SeasonOutputListData[]

  constructor (entity?: ScoreEntity) {
    super(entity)

    if (entity != null) {
      this.seasons = entity.seasons?.map(
        seasonEntity => new SeasonOutputListData(seasonEntity)
      )
    }
  }
}

export class ScoreOutputListData extends ScoreOutputData {}
