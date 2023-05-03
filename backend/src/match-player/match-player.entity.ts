import { EAMatchPlayerResult } from '../ea-match-data/ea-match-data.interface'
import { MatchEntity } from '../match/match.entity'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('match-player')
export class MatchPlayerEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Index()
  @Column({ nullable: false, default: true })
    active: boolean

  @Index()
  @Column()
    name: string

  @Index()
  @Column()
    kills: number

  @Index()
  @Column()
    assists: number

  @Index()
  @Column()
    damage: number

  @Index()
  @Column()
    survivalTime: number

  @Index()
  @Column()
    teamName: string

  @Index()
  @Column()
    teamNum: number

  @Index()
  @Column()
    teamPlacement: number

  @Index()
  @Column({ default: 0 })
    hits: number

  @Index()
  @Column({ default: '' })
    characterName: string

  @Index()
  @Column({ default: 0 })
    revivesGiven: number

  @Index()
  @Column({ default: 0 })
    knockdowns: number

  @Index()
  @Column({ default: 0 })
    respawnsGiven: number

  @Index()
  @Column({ default: 0 })
    headshots: number

  @Index()
  @Column({ default: 0 })
    shots: number

  @ManyToOne(
    () => MatchEntity,
    match => match.matchPlayers
  )
    match: MatchEntity

  constructor (playerResult?: EAMatchPlayerResult) {
    if (playerResult != null) {
      this.name = playerResult.playerName
      this.kills = playerResult.kills
      this.assists = playerResult.assists
      this.damage = playerResult.damageDealt
      this.survivalTime = playerResult.survivalTime
      this.teamName = playerResult.teamName
      this.teamNum = playerResult.teamNum
      this.teamPlacement = playerResult.teamPlacement
      this.hits = playerResult.hits
      this.characterName = playerResult.characterName
      this.revivesGiven = playerResult.revivesGiven
      this.knockdowns = playerResult.knockdowns
      this.respawnsGiven = playerResult.respawnsGiven
      this.headshots = playerResult.headshots
      this.shots = playerResult.shots
    }
  }
}
