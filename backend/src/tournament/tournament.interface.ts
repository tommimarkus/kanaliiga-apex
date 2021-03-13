import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { MatchOutputData } from 'src/match/match.interface';

export class TournamentData {
  @ApiPropertyOptional()
  name?: string;
}

export class TournamentOutputData extends TournamentData {
  @ApiProperty({ type: [MatchOutputData] })
  matches: MatchOutputData[];
}

export class TournamentOutputListData extends TournamentData {
  @ApiProperty()
  id: number;
}

export class TournamentInputData extends TournamentData {
  @ApiProperty()
  matchTokens: string[];
}

export class TournamentInputCSVData extends TournamentData {
  @ApiProperty({ type: 'file' })
  file: Express.Multer.File;
}

export class TournamentCSVData {
  @ApiProperty()
  token: string;

  @ApiProperty()
  activation: string;

  @ApiProperty()
  expiration: string;

  @ApiProperty()
  matchToken: string;

  // @ApiHideProperty()
  // adminToken: string;

  // @ApiHideProperty()
  // playerToken: string;
}
