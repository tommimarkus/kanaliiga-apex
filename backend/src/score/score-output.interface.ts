import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TournamentOutputListData } from '../tournament/tournament-output.interface';
import { ScoreEntity } from './score.entity';
import { ScoreData } from './score-input.interface';

export class ScoreOutputData extends ScoreData {
  @ApiProperty()
  id: number;

  constructor(entity?: ScoreEntity) {
    super(entity);

    if (entity) {
      this.id = entity.id;
    }
  }
}

export class ScoreOutputOneData extends ScoreOutputData {
  @ApiPropertyOptional({ type: [TournamentOutputListData] })
  tournaments?: TournamentOutputListData[];

  constructor(entity?: ScoreEntity) {
    super(entity);

    if (entity) {
      this.tournaments = entity.tournaments?.map(
        tournamentEntity => new TournamentOutputListData(tournamentEntity),
      );
    }
  }
}

export class ScoreOutputListData extends ScoreOutputData {
  constructor(entity?: ScoreEntity) {
    super(entity);
  }
}
