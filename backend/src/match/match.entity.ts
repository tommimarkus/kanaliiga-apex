import { EAMatchData } from '../ea-match-data/ea-match-data.interface';
import { MatchPlayerEntity } from '../match-player/match-player.entity';
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
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
    () => GroupEntity,
    group => group.matches,
    { nullable: true },
  )
  group?: GroupEntity;

  constructor(params?: {
    token: string;
    matchData?: EAMatchData;
    group?: GroupEntity;
  }) {
    if (params) {
      const { token, matchData, group } = params;
      this.token = token;
      if (matchData) {
        this.start =
          matchData.match_start && new Date(matchData.match_start * 1000);
        this.matchPlayers = matchData.player_results.map(
          playerResult => new MatchPlayerEntity(playerResult),
        );
      } else {
        this.matchPlayers = [];
      }
      this.group = group;
    }
  }
}
