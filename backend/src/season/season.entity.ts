import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { SeasonInputData } from './season.interface';

@Entity('season')
export class SeasonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  start: Date;

  @OneToMany(
    () => TournamentEntity,
    tournament => tournament.season,
    { eager: true, cascade: true, nullable: false },
  )
  tournaments: TournamentEntity[];

  constructor(seasonInputData?: SeasonInputData) {
    if (seasonInputData) {
      this.start = seasonInputData.start && new Date(seasonInputData.start);
      this.name = seasonInputData.name;
      this.tournaments = [];
    }
  }
}
