import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { GroupEntity } from '../group/group.entity';
import { MatchEntity } from '../match/match.entity';
import { SeasonEntity } from '../season/season.entity';
import { TournamentInputData } from './tournament.interface';

@Entity('tournament')
export class TournamentEntity {
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
    match => match.tournament,
    { eager: true, cascade: true, nullable: false },
  )
  matches: MatchEntity[];

  @OneToMany(
    () => GroupEntity,
    group => group.tournament,
    { eager: true, cascade: true, nullable: false },
  )
  groups: GroupEntity[];

  @ManyToOne(
    () => SeasonEntity,
    season => season.tournaments,
    { nullable: true },
  )
  season?: SeasonEntity;

  constructor(token?: string, tournamentInputData?: TournamentInputData) {
    if (token && tournamentInputData) {
      this.token = token;
      this.start =
        tournamentInputData.start && new Date(tournamentInputData.start);
      this.name = tournamentInputData.name;
      this.matches = tournamentInputData.matchTokens.map(matchToken => {
        const matchEntity = new MatchEntity();
        matchEntity.token = matchToken;
        matchEntity.tournament = this;
        matchEntity.matchPlayers = [];
        return matchEntity;
      });
    }
  }
}
