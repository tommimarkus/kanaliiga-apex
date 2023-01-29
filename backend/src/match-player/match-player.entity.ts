import { EAMatchPlayerResult } from '../ea-match-data/ea-match-data.interface'
import { MatchEntity } from '../match/match.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('match-player')
export class MatchPlayerEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ nullable: false, default: true })
    active: boolean

  @Column()
    name: string

  @Column()
    kills: number

  @Column()
    assists: number

  @Column()
    damage: number

  @Column()
    survivalTime: number

  @Column()
    teamName: string

  @Column()
    teamNum: number

  @Column()
    teamPlacement: number

  @Column({ default: 0 })
    hits: number

  @Column({ default: '' })
    characterName: string

  @Column({ default: 0 })
    revivesGiven: number

  @Column({ default: 0 })
    knockdowns: number

  @Column({ default: 0 })
    respawnsGiven: number

  @Column({ default: 0 })
    headshots: number

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
