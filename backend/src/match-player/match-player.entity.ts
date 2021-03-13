import { EAMatchPlayerResult } from '../ea-match-data/ea-match-data.interface';
import { MatchEntity } from '../match/match.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match-player')
export class MatchPlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  kills: number;

  @Column()
  assists: number;

  @Column()
  damage: number;

  @Column()
  survivalTime: number;

  @Column()
  teamName: string;

  @Column()
  teamNum: number;

  @Column()
  teamPlacement: number;

  @ManyToOne(
    () => MatchEntity,
    match => match.matchPlayers,
  )
  match: MatchEntity;

  constructor(playerResult?: EAMatchPlayerResult) {
    if (playerResult) {
      this.name = playerResult.playerName;
      this.kills = playerResult.kills;
      this.assists = playerResult.assists;
      this.damage = playerResult.damageDealt;
      this.survivalTime = playerResult.survivalTime;
      this.teamName = playerResult.teamName;
      this.teamNum = playerResult.teamNum;
      this.teamPlacement = playerResult.teamPlacement;
    }
  }
}
