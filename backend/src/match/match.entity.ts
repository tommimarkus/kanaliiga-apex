import { EAMatchData } from '../ea-match-data/ea-match-data.interface';
import { MatchPlayerEntity } from '../match-player/match-player.entity';
import {
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { TournamentEntity } from '../tournament/tournament.entity';

@Entity('match')
@Unique('unique_token_index', ['token', 'index'])
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false, default: 0 })
  index: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  start?: Date;

  @OneToMany(
    () => MatchPlayerEntity,
    matchPlayer => matchPlayer.match,
    { eager: true, cascade: true },
  )
  matchPlayers: MatchPlayerEntity[];

  @ManyToOne(
    () => TournamentEntity,
    tournament => tournament.matches,
    { nullable: true },
  )
  tournament?: TournamentEntity;

  constructor(token?: string, index?: number, matchData?: EAMatchData) {
    if (typeof token === 'string' && typeof index === 'number' && matchData) {
      this.token = token;
      this.index = index;
      this.start =
        matchData.match_start && new Date(matchData.match_start * 1000);
      this.matchPlayers = matchData.player_results.map(
        playerResult => new MatchPlayerEntity(playerResult),
      );
    }
  }
}
