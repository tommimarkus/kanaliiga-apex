import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { GroupEntity } from '../group/group.entity';
import { SeasonEntity } from '../season/season.entity';
import { TournamentInputData } from './tournament-input.interface';

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
    () => GroupEntity,
    group => group.tournament,
    { nullable: true },
  )
  groups?: GroupEntity[];

  @ManyToOne(
    () => SeasonEntity,
    season => season.tournaments,
    { nullable: true },
  )
  season?: SeasonEntity;

  constructor(
    token?: string,
    tournamentInputData?: TournamentInputData,
    seasonEntity?: SeasonEntity,
  ) {
    if (token && tournamentInputData) {
      this.token = token;
      this.name = tournamentInputData.name;
      this.start =
        tournamentInputData.start && new Date(tournamentInputData.start);
      if (seasonEntity) {
        this.season = seasonEntity;
      } else {
        throw Error('Season data is missing');
      }
    }
  }
}
