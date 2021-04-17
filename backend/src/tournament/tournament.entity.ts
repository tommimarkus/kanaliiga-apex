import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { GroupEntity } from '../group/group.entity';
import { ScoreInputData } from '../score/score-input.interface';
import { ScoreEntity } from '../score/score.entity';
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
    { cascade: ['insert'], nullable: false },
  )
  groups: GroupEntity[];

  @ManyToOne(
    () => SeasonEntity,
    season => season.tournaments,
    { nullable: false },
  )
  season: SeasonEntity;

  @ManyToOne(
    () => ScoreEntity,
    score => score.tournaments,
    { cascade: ['insert'], nullable: false },
  )
  score: ScoreEntity;

  constructor(
    token?: string,
    tournamentInputData?: TournamentInputData,
    seasonEntity?: SeasonEntity,
    scoreEntity?: ScoreEntity,
  ) {
    if (token && tournamentInputData) {
      this.token = token;
      this.name = tournamentInputData.name;
      this.start =
        tournamentInputData.start && new Date(tournamentInputData.start);
      this.groups = tournamentInputData.groups.map(
        group => new GroupEntity(group),
      );
      if (seasonEntity) {
        this.season = seasonEntity;
      } else {
        throw Error('Season data is missing');
      }
      if (scoreEntity) {
        this.score = scoreEntity;
      } else {
        if (tournamentInputData.score instanceof ScoreInputData) {
          this.score = new ScoreEntity(tournamentInputData.score);
        } else {
          throw Error('Score data is missing');
        }
      }
    }
  }
}
