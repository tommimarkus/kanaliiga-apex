import { ApiProperty } from '@nestjs/swagger';
import { MatchOutputOneData } from '../match/match-output.interface';
import { TournamentOutputListData } from '../tournament/tournament-output.interface';
import { GroupEntity } from './group.entity';
import { GroupData } from './group-input.interface';

export class GroupOutputData extends GroupData {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ type: TournamentOutputListData })
  tournament: TournamentOutputListData;

  constructor(entity?: GroupEntity) {
    super(entity);

    if (entity) {
      this.id = entity.id;
      this.active = entity.active;
      this.tournament = new TournamentOutputListData(entity.tournament);
    }
  }
}

export class GroupOutputOneData extends GroupOutputData {
  @ApiProperty({ type: [MatchOutputOneData] })
  matches: MatchOutputOneData[];

  constructor(entity?: GroupEntity) {
    super(entity);
  }
}

export class GroupOutputListData extends GroupOutputData {
  constructor(entity?: GroupEntity) {
    super(entity);
  }
}
