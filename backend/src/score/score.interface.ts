import { ApiProperty } from '@nestjs/swagger';

// INPUT

export class ScoreData {}

export class ScoreInputData extends ScoreData {}

// OUTPUT

export class ScoreOutputData extends ScoreData {
  @ApiProperty()
  id: number;
}

export class ScoreOutputOneData extends ScoreOutputData {}

export class ScoreOutputListData extends ScoreOutputData {}
