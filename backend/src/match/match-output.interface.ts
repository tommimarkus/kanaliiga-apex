import { ApiProperty } from '@nestjs/swagger'
import { GroupOutputData } from '../group/group-output.interface'
import { matchEntityToMatchResultsOutput } from '../util/util'
import { type MatchEntity } from './match.entity'
import { MatchData } from './match-input.interface'
import { type MatchPlayerEntity } from '../match-player/match-player.entity'

export class MatchResultTeamMemberOutputData {
  @ApiProperty({ example: 'SourOldGeezer' })
    name: string

  @ApiProperty({ example: 16 })
    kills: number

  @ApiProperty({ example: 9 })
    assists: number

  @ApiProperty({ example: 3926 })
    damage: number

  @ApiProperty({ example: 1392 })
    survivalTime: number

  constructor (entity: MatchPlayerEntity) {
    if (entity != null) {
      this.name = entity.name
      this.kills = entity.kills
      this.assists = entity.assists
      this.survivalTime = entity.survivalTime
    }
  }
}

export class MatchResultOutputData {
  @ApiProperty({ example: 8 })
    teamNum: number

  @ApiProperty({ example: 'Vincit' })
    teamName: string

  @ApiProperty({ example: 1 })
    teamPlacement: number

  @ApiProperty({ example: 28 })
    teamKills: number

  @ApiProperty({ example: 40 })
    teamPoints: number

  @ApiProperty({ type: [MatchResultTeamMemberOutputData] })
    teamMembers: MatchResultTeamMemberOutputData[]

  @ApiProperty({ example: 7222 })
    teamDamage: number
}

export class MatchOutputData extends MatchData {
  @ApiProperty()
    id: number

  @ApiProperty({ example: true })
    active: boolean

  @ApiProperty({ type: GroupOutputData })
    group?: GroupOutputData

  constructor (entity?: MatchEntity) {
    super(entity)

    if (entity != null) {
      this.id = entity.id
      this.active = entity.active
      this.group = (entity.group != null) ? new GroupOutputData(entity.group) : undefined
    }
  }
}

export class MatchOutputOneData extends MatchOutputData {
  @ApiProperty({ type: [MatchResultOutputData] })
    results: MatchResultOutputData[]

  constructor (entity?: MatchEntity) {
    super(entity)

    if (entity != null) {
      this.results = matchEntityToMatchResultsOutput(entity)
    }
  }
}

export class MatchOutputListData extends MatchOutputData {}
