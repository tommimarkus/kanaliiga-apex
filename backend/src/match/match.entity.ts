import { MatchPlayerEntity } from 'src/match-player/match-player.entity';
import { Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity('match')
export class MatchEntity {
  @PrimaryColumn()
  token: string;

  @Column()
  start: Date;

  @OneToMany(
    () => MatchPlayerEntity,
    matchPlayer => matchPlayer.match,
    { eager: true, cascade: true },
  )
  matchPlayers: MatchPlayerEntity[];

  constructor(token?: string, matchData?: EAMatchData) {
    if (token && matchData) {
      this.token = token;
      this.start = new Date(matchData.match_start);
      this.matchPlayers = matchData.player_results.map(
        playerResult => new MatchPlayerEntity(playerResult),
      );
    }
  }
}
