import { ApiProperty } from '@nestjs/swagger';

export interface IEAMatchPlayerResult {
  kills: number;
  damageDealt: number;
  playerName: string;
  survivalTime: number;
  teamPlacement: number;
  teamName: string;
  teamNum: number;
  assists: number;
  hits: number;
  revivesGiven: number;
  knockdowns: number;
  headshots: number;
  shots: number;
  nidHash: string;
}

export class EAMatchPlayerResult implements IEAMatchPlayerResult {
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

  @ApiProperty({ example: 112 })
  hits: number;

  @ApiProperty({ example: 'valkyrie' })
  characterName: string;

  @ApiProperty({ example: 1 })
  revivesGiven: number;

  @ApiProperty({ example: 3 })
  knockdowns: number;

  @ApiProperty({ example: 0 })
  respawnsGiven: number;

  @ApiProperty({ example: 15 })
  headshots: number;

  @ApiProperty({ example: 266 })
  shots: number;

  @ApiProperty({
    example:
      '4060bbcd5984193a2f0d7f48d5ed536277f4c8e68227540165bc35ddfa7c386a693a0871926a01b2778e12a279c8d7ed2cebd2cf60e62d749ccb6911313ea33d',
  })
  nidHash: string;
}

export class EAMatchData {
  @ApiProperty({ example: 1618683819 })
  match_start: number;

  @ApiProperty({ type: [EAMatchPlayerResult] })
  player_results: EAMatchPlayerResult[];

  @ApiProperty({ example: false })
  aim_assist_allowed: boolean;

  @ApiProperty({ example: 'mp_rr_desertlands_mu3' })
  map_name: string;

  @ApiProperty({ example: '[::ffff:199.244.150.173]:0:33715:1667551695' })
  mid: string;
}

export class EAMatchesData {
  @ApiProperty({ type: [EAMatchData] })
  matches: EAMatchData[];
}
