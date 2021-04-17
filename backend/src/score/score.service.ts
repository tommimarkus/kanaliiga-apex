import { Injectable } from '@nestjs/common';
import { ScoreEntity } from './score.entity';
import { ScoreInputData } from './score-input.interface';
import { ScoreRepository } from './score.repository';

@Injectable()
export class ScoreService {
  constructor(private scoreRepository: ScoreRepository) {}

  async find(): Promise<ScoreEntity[]> {
    return await this.scoreRepository.find();
  }

  async findOne(id: number): Promise<ScoreEntity> | undefined {
    return await this.scoreRepository.findOne(id);
  }

  async findOneOrFail(id: number): Promise<ScoreEntity> {
    return await this.scoreRepository.findOneOrFail(id);
  }

  async save(scoreInputData: ScoreInputData): Promise<ScoreEntity> | undefined {
    const scoreEntity = new ScoreEntity(scoreInputData);
    return await this.scoreRepository.save(scoreEntity);
  }
}
