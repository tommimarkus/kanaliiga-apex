import { Injectable } from '@nestjs/common';
import { SeasonEntity } from './season.entity';
import { SeasonInputData } from './season-input.interface';
import { SeasonRepository } from './season.repository';

@Injectable()
export class SeasonService {
  constructor(private seasonRepository: SeasonRepository) {}

  async find(): Promise<SeasonEntity[]> {
    return await this.seasonRepository.find({
      select: ['id', 'active', 'name', 'start', 'end'],
      where: { active: true },
    });
  }

  async findOne(id: number): Promise<SeasonEntity> | undefined {
    return await this.seasonRepository.findOne(id, {
      where: { active: true },
    });
  }

  async save(
    seasonInputData: SeasonInputData,
  ): Promise<SeasonEntity> | undefined {
    const seasonEntity = new SeasonEntity(seasonInputData);
    return await this.seasonRepository.save(seasonEntity);
  }
}
