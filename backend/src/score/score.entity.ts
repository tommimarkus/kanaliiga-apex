import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SeasonEntity } from '../season/season.entity'
import { ScoreInputData } from './score-input.interface'

@Entity('score')
export class ScoreEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ nullable: false })
    kill: number

  @Column({ nullable: false })
    placement1: number

  @Column({ nullable: false })
    placement2: number

  @Column({ nullable: false })
    placement3: number

  @Column({ nullable: false })
    placement4: number

  @Column({ nullable: false })
    placement5: number

  @Column({ nullable: false })
    placement6: number

  @Column({ nullable: false })
    placement7: number

  @Column({ nullable: false })
    placement8: number

  @Column({ nullable: false })
    placement9: number

  @Column({ nullable: false })
    placement10: number

  @Column({ nullable: false })
    placement11: number

  @Column({ nullable: false })
    placement12: number

  @Column({ nullable: false })
    placement13: number

  @Column({ nullable: false })
    placement14: number

  @Column({ nullable: false })
    placement15: number

  @Column({ nullable: false })
    placement16: number

  @Column({ nullable: false })
    placement17: number

  @Column({ nullable: false })
    placement18: number

  @Column({ nullable: false })
    placement19: number

  @Column({ nullable: false })
    placement20: number

  @OneToMany(
    () => SeasonEntity,
    season => season.score,
    { nullable: true }
  )
    seasons?: SeasonEntity[]

  constructor (inputData?: ScoreInputData) {
    if (inputData != null) {
      this.kill = inputData.kill
      this.placement1 = inputData.placement1
      this.placement2 = inputData.placement2
      this.placement3 = inputData.placement3
      this.placement4 = inputData.placement4
      this.placement5 = inputData.placement5
      this.placement6 = inputData.placement6
      this.placement7 = inputData.placement7
      this.placement8 = inputData.placement8
      this.placement9 = inputData.placement9
      this.placement10 = inputData.placement10
      this.placement11 = inputData.placement11
      this.placement12 = inputData.placement12
      this.placement13 = inputData.placement13
      this.placement14 = inputData.placement14
      this.placement15 = inputData.placement15
      this.placement16 = inputData.placement16
      this.placement17 = inputData.placement17
      this.placement18 = inputData.placement18
      this.placement19 = inputData.placement19
      this.placement20 = inputData.placement20
      this.seasons = undefined
    }
  }
}
