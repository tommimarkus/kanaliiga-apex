import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { MatchEntity } from '../match/match.entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { GroupInputData } from './group.interface';

@Entity('group')
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ unique: true, nullable: false })
  token: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  start: Date;

  @OneToMany(
    () => MatchEntity,
    match => match.group,
    { eager: true, cascade: true, nullable: false },
  )
  matches: MatchEntity[];

  @ManyToOne(
    () => TournamentEntity,
    tournament => tournament.groups,
    { nullable: true },
  )
  tournament?: TournamentEntity;

  constructor(token?: string, groupInputData?: GroupInputData) {
    if (token && groupInputData) {
      this.token = token;
      this.start = groupInputData.start && new Date(groupInputData.start);
      this.name = groupInputData.name;
      this.matches = groupInputData.matchTokens.map(matchToken => {
        const matchEntity = new MatchEntity();
        matchEntity.token = matchToken;
        matchEntity.group = this;
        matchEntity.matchPlayers = [];
        return matchEntity;
      });
    }
  }
}
