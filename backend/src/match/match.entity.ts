import { type EAMatchData } from '../ea-match-data/ea-match-data.interface'
import { MatchPlayerEntity } from '../match-player/match-player.entity'
import {
  Column,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'
import { Entity } from 'typeorm/decorator/entity/Entity'
import { GroupEntity } from '../group/group.entity'

@Entity('match')
@Unique('unique_token_index', ['token', 'index'])
export class MatchEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Index()
  @Column({ nullable: false, default: true })
    active: boolean

  @Index()
  @Column({ nullable: false })
    token: string

  @Index()
  @Column({ nullable: false, default: 0 })
    index: number

  @Index()
  @Column({ type: 'timestamp with time zone', nullable: true })
    start?: Date

  @Index()
  @Column({ nullable: true })
    aimAssistAllowed?: boolean

  @Index()
  @Column({ nullable: true })
    mapName?: string

  @OneToMany(
    () => MatchPlayerEntity,
    matchPlayer => matchPlayer.match,
    { cascade: ['insert', 'update'] }
  )
    matchPlayers?: MatchPlayerEntity[]

  @ManyToOne(
    () => GroupEntity,
    group => group.matches,
    { nullable: true }
  )
    group?: GroupEntity

  constructor (params?: {
    token: string
    matchData?: EAMatchData
    group?: GroupEntity
    index: number
  }) {
    if (params != null) {
      const { token, matchData, group, index } = params
      if (typeof token === 'string' && typeof index === 'number') {
        this.token = token
        this.index = index
        if (matchData != null) {
          this.start = typeof matchData.match_start === 'number' ? new Date(matchData.match_start * 1000) : undefined
          this.aimAssistAllowed = matchData.aim_assist_allowed
          this.mapName = matchData.map_name
          this.matchPlayers = matchData.player_results.map(
            playerResult => new MatchPlayerEntity(playerResult)
          )
        }
        if (group != null) {
          this.group = group
        }
      }
    }
  }
}
