import { ApiProperty } from '@nestjs/swagger';

export class EAMatchPlayerResult {
  @ApiProperty({ example: 16 })
  kills: number;

  @ApiProperty({ example: 3926 })
  damageDealt: number;

  @ApiProperty()
  playerName: string;

  @ApiProperty({ example: 1392 })
  survivalTime: number;

  @ApiProperty({ example: 1 })
  teamPlacement: number;

  @ApiProperty({ example: 'Vincit' })
  teamName: string;

  @ApiProperty({ example: 8 })
  teamNum: number;

  @ApiProperty({ example: 9 })
  assists: number;
}

export class EAMatchData {
  @ApiProperty({ example: 1618683819 })
  match_start: number;

  @ApiProperty({ type: [EAMatchPlayerResult] })
  player_results: EAMatchPlayerResult[];
}

export class EAMatchesData {
  @ApiProperty({ type: [EAMatchData] })
  matches: EAMatchData[];
}
