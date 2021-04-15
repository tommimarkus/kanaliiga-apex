import { EAMatchData } from '../ea-match-data/ea-match-data.interface';
import { MatchPlayerEntity } from '../match-player/match-player.entity';
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { GroupEntity } from '../group/group.entity';

@Entity('match')
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ unique: true })
  token: string;

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

  @ManyToOne(
    () => GroupEntity,
    group => group.matches,
    { nullable: true },
  )
  group?: GroupEntity;

  constructor(token?: string, matchData?: EAMatchData) {
    if (token && matchData) {
      this.token = token;
      this.start =
        matchData.match_start && new Date(matchData.match_start * 1000);
      this.matchPlayers = matchData.player_results.map(
        playerResult => new MatchPlayerEntity(playerResult),
      );
    }
  }
}
