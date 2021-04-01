import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { MatchEntity } from '../match/match.entity';
import { TournamentInputData } from './tournament.interface';

@Entity('tournament')
export class TournamentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @Column({ nullable: true })
  name?: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  start: Date;

  @OneToMany(
    () => MatchEntity,
    match => match.tournament,
    { eager: true, cascade: true },
  )
  matches: MatchEntity[];

  constructor(token?: string, tournamentInputData?: TournamentInputData) {
    if (token && tournamentInputData) {
      this.token = token;
      this.start = new Date(tournamentInputData.start);
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
