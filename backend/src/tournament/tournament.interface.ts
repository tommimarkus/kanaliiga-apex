import { ApiProperty } from '@nestjs/swagger';
import { MatchOutputData } from 'src/match/match.interface';

export class TournamentData {
  @ApiProperty()
  name?: string;
}

export class TournamentOutputData extends TournamentData {
  @ApiProperty({ type: [MatchOutputData] })
  matches: MatchOutputData[];
}

export class TournamentInputData extends TournamentData {
  @ApiProperty()
  matchTokens: string[];
}
