import { ApiProperty } from '@nestjs/swagger';

export class EAMatchPlayerResult {
  @ApiProperty()
  kills: number;

  @ApiProperty()
  damageDealt: number;

  @ApiProperty()
  playerName: string;

  @ApiProperty()
  survivalTime: number;

  @ApiProperty()
  teamPlacement: number;

  @ApiProperty()
  teamName: string;

  @ApiProperty()
  teamNum: number;

  @ApiProperty()
  assists: number;
}

export class EAMatchData {
  @ApiProperty()
  match_start: number;

  @ApiProperty({ type: [EAMatchPlayerResult] })
  player_results: EAMatchPlayerResult[];
}

export class EAMatchesData {
  @ApiProperty({ type: [EAMatchData] })
  matches: EAMatchData[];
}
