import { Injectable } from '@nestjs/common';
import {
  ScoreInputData,
  ScoreOutputListData,
  ScoreOutputOneData,
} from './score.interface';
import { ScoreRepository } from './score.repository';

@Injectable()
export class ScoreService {
  constructor(private scoreRepository: ScoreRepository) {}

  async find(): Promise<ScoreOutputListData[]> {
    return [];
  }

  async findOne(id: number): Promise<ScoreOutputOneData> | undefined {
    return undefined;
  }

  async save(
    scoreInputData: ScoreInputData,
  ): Promise<ScoreOutputOneData> | undefined {
    return undefined;
  }
}
