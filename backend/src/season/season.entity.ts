import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Entity } from 'typeorm/decorator/entity/Entity'
import { ScoreInputData } from '../score/score-input.interface'
import { ScoreEntity } from '../score/score.entity'
import { TournamentEntity } from '../tournament/tournament.entity'
import { SeasonInputData } from './season-input.interface'

@Entity('season')
export class SeasonEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ nullable: false, default: true })
    active: boolean

  @Column({ nullable: true })
    name: string

  @Column({
    type: 'timestamp with time zone',
    nullable: false
  })
    start: Date

  @Column({
    type: 'timestamp with time zone',
    nullable: false
  })
    end: Date

  @OneToMany(
    () => TournamentEntity,
    tournament => tournament.season,
    { nullable: true }
  )
    tournaments?: TournamentEntity[]

  @ManyToOne(
    () => ScoreEntity,
    score => score.seasons,
    { nullable: true }
  )
    score?: ScoreEntity

  constructor (seasonInputData?: SeasonInputData, scoreEntity?: ScoreEntity) {
    if (seasonInputData != null) {
      if (typeof seasonInputData.start === 'string' && typeof seasonInputData.end === 'string') {
        this.start = new Date(seasonInputData.start)
        this.end = new Date(seasonInputData.end)
        this.name = seasonInputData.name
        this.tournaments = undefined
        if (scoreEntity != null) {
          this.score = scoreEntity
        } else {
          if (seasonInputData.score instanceof ScoreInputData) {
            this.score = new ScoreEntity(seasonInputData.score)
          }
        }
      }
    }
  }
}
