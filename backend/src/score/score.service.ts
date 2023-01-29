import { Injectable } from '@nestjs/common'
import { ScoreEntity } from './score.entity'
import { type ScoreInputData } from './score-input.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class ScoreService {
  constructor (@InjectRepository(ScoreEntity) private readonly scoreRepository: Repository<ScoreEntity>) {}

  async find (): Promise<ScoreEntity[]> {
    return await this.scoreRepository.find()
  }

  async findOne (id: number): Promise<ScoreEntity | null> {
    return await this.scoreRepository.findOneBy({ id })
  }

  async findOneOrFail (id: number): Promise<ScoreEntity> {
    return await this.scoreRepository.findOneByOrFail({ id })
  }

  async save (scoreInputData: ScoreInputData): Promise<ScoreEntity | undefined> {
    const scoreEntity = new ScoreEntity(scoreInputData)
    return await this.scoreRepository.save(scoreEntity)
  }
}
