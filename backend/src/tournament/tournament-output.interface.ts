import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { GroupOutputOneData } from '../group/group-output.interface'
import {
  SeasonOutputData,
  SeasonOutputListData
} from '../season/season-output.interface'
import { type TournamentEntity } from './tournament.entity'
import { TournamentData } from './tournament-input.interface'

export class TournamentOutputData extends TournamentData {
  @ApiProperty()
    id: number

  @ApiProperty()
    active: boolean

  @ApiPropertyOptional()
    season?: SeasonOutputData

  constructor (entity?: TournamentEntity) {
    super(entity)

    if (entity != null) {
      this.id = entity.id
      this.active = entity.active
      this.season = (entity.season != null)
        ? new SeasonOutputListData(entity.season)
        : undefined
    }
  }
}

export class TournamentOutputOneData extends TournamentOutputData {
  @ApiProperty({ type: [GroupOutputOneData] })
    groups: GroupOutputOneData[]

  constructor (entity?: TournamentEntity) {
    super(entity)

    if (entity != null) {
      this.groups = entity.groups?.map(group => new GroupOutputOneData(group)) ?? []
    }
  }
}

export class TournamentOutputListData extends TournamentOutputData {}
