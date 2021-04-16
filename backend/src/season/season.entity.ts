import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { SeasonInputData } from './season-input.interface';

@Entity('season')
export class SeasonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  start: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  end: Date;

  @OneToMany(
    () => TournamentEntity,
    tournament => tournament.season,
    { eager: true, cascade: true, nullable: false },
  )
  tournaments: TournamentEntity[];

  constructor(seasonInputData?: SeasonInputData) {
    if (seasonInputData) {
      this.start = seasonInputData.start && new Date(seasonInputData.start);
      this.end = seasonInputData.end && new Date(seasonInputData.end);
      this.name = seasonInputData.name;
      this.tournaments = [];
    }
  }
}
