import {
  Column,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'
import { Entity } from 'typeorm/decorator/entity/Entity'
import { MatchEntity } from '../match/match.entity'
import { TournamentEntity } from '../tournament/tournament.entity'
import { GroupInputData } from './group-input.interface'

@Entity('group')
@Unique('tournament_order', ['tournament', 'order'])
export class GroupEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Index()
  @Column({ nullable: false, default: true })
    active: boolean

  @Index()
  @Column({ nullable: false })
    order: number

  @OneToMany(
    () => MatchEntity,
    match => match.group,
    { nullable: true }
  )
    matches?: MatchEntity[]

  @ManyToOne(
    () => TournamentEntity,
    tournament => tournament.groups,
    { nullable: true }
  )
    tournament?: TournamentEntity

  constructor (groupInputData?: GroupInputData, tournament?: TournamentEntity) {
    if (groupInputData != null) {
      this.order = groupInputData.order
      this.matches = []
      if (tournament != null) {
        this.tournament = tournament
      }
    }
  }
}
