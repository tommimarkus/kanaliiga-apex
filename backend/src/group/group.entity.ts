import {
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { MatchEntity } from '../match/match.entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { GroupInputData } from './group-input.interface';

@Entity('group')
@Unique('tournament_order', ['tournament', 'order'])
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ nullable: false })
  order: number;

  @OneToMany(
    () => MatchEntity,
    match => match.group,
    { cascade: ['insert'] },
  )
  matches: MatchEntity[];

  @ManyToOne(
    () => TournamentEntity,
    tournament => tournament.groups,
    { nullable: false },
  )
  tournament: TournamentEntity;

  constructor(groupInputData?: GroupInputData, tournament?: TournamentEntity) {
    if (groupInputData) {
      this.order = groupInputData.order;
      this.matches = [];
      if (tournament) {
        this.tournament = tournament;
      }
    }
  }
}
