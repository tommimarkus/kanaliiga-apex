import { ApiProperty } from '@nestjs/swagger'
import { type ScoreEntity } from './score.entity'

export class ScoreData {
  @ApiProperty({ nullable: false, example: 1 })
    kill: number

  @ApiProperty({ nullable: false, example: 12 })
    placement1: number

  @ApiProperty({ nullable: false, example: 9 })
    placement2: number

  @ApiProperty({ nullable: false, example: 7 })
    placement3: number

  @ApiProperty({ nullable: false, example: 5 })
    placement4: number

  @ApiProperty({ nullable: false, example: 4 })
    placement5: number

  @ApiProperty({ nullable: false, example: 3 })
    placement6: number

  @ApiProperty({ nullable: false, example: 3 })
    placement7: number

  @ApiProperty({ nullable: false, example: 2 })
    placement8: number

  @ApiProperty({ nullable: false, example: 2 })
    placement9: number

  @ApiProperty({ nullable: false, example: 2 })
    placement10: number

  @ApiProperty({ nullable: false, example: 1 })
    placement11: number

  @ApiProperty({ nullable: false, example: 1 })
    placement12: number

  @ApiProperty({ nullable: false, example: 1 })
    placement13: number

  @ApiProperty({ nullable: false, example: 1 })
    placement14: number

  @ApiProperty({ nullable: false, example: 1 })
    placement15: number

  @ApiProperty({ nullable: false, example: 0 })
    placement16: number

  @ApiProperty({ nullable: false, example: 0 })
    placement17: number

  @ApiProperty({ nullable: false, example: 0 })
    placement18: number

  @ApiProperty({ nullable: false, example: 0 })
    placement19: number

  @ApiProperty({ nullable: false, example: 0 })
    placement20: number

  constructor (entity?: ScoreEntity) {
    if (entity != null) {
      this.kill = entity.kill
      this.placement1 = entity.placement1
      this.placement2 = entity.placement2
      this.placement3 = entity.placement3
      this.placement4 = entity.placement4
      this.placement5 = entity.placement5
      this.placement6 = entity.placement6
      this.placement7 = entity.placement7
      this.placement8 = entity.placement8
      this.placement9 = entity.placement9
      this.placement10 = entity.placement10
      this.placement11 = entity.placement11
      this.placement12 = entity.placement12
      this.placement13 = entity.placement13
      this.placement14 = entity.placement14
      this.placement15 = entity.placement15
      this.placement16 = entity.placement16
      this.placement17 = entity.placement17
      this.placement18 = entity.placement18
      this.placement19 = entity.placement19
      this.placement20 = entity.placement20
    }
  }
}

export class ScoreInputData extends ScoreData {}
