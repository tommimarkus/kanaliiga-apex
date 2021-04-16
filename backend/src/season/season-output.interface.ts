import { ApiProperty } from '@nestjs/swagger';
import { TournamentOutputOneData } from '../tournament/tournament-output.interface';
import { SeasonEntity } from './season.entity';
import { SeasonData } from './season-input.interface';

export class SeasonOutputData extends SeasonData {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: true })
  active: boolean;

  constructor(entity?: SeasonEntity) {
    super(entity);

    if (entity) {
      this.id = entity.id;
      this.active = entity.active;
    }
  }
}

export class SeasonOutputOneData extends SeasonOutputData {
  @ApiProperty({ type: [TournamentOutputOneData] })
  tournaments: TournamentOutputOneData[];

  constructor(entity?: SeasonEntity) {
    super(entity);

    if (entity) {
      this.tournaments = entity.tournaments.map(
        tournamentEntity => new TournamentOutputOneData(tournamentEntity),
      );
    }
  }
}

export class SeasonOutputListData extends SeasonOutputData {
  constructor(entity?: SeasonEntity) {
    super(entity);
  }
}
