import { EAMatchPlayerResult } from '../ea-match-data/ea-match-data.interface';
import { MatchEntity } from '../match/match.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match-player')
export class MatchPlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  active: boolean;

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

  @Column()
  hits: number;

  @Column()
  characterName: string;

  @Column()
  revivesGiven: number;

  @Column()
  knockdowns: number;

  @Column()
  respawnsGiven: number;

  @Column()
  headshots: number;

  @Column()
  shots: number;

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
      this.hits = playerResult.hits;
      this.characterName = playerResult.characterName;
      this.revivesGiven = playerResult.revivesGiven;
      this.knockdowns = playerResult.knockdowns;
      this.respawnsGiven = playerResult.respawnsGiven;
      this.headshots = playerResult.headshots;
      this.shots = playerResult.shots;
    }
  }
}
