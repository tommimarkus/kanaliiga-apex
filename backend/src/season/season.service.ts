import { BadRequestException, Injectable } from '@nestjs/common';
import { SeasonEntity } from './season.entity';
import { SeasonInputData } from './season-input.interface';
import { SeasonRepository } from './season.repository';
import { FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class SeasonService {
  constructor(private seasonRepository: SeasonRepository) {}

  private readonly findOneOptions: FindOneOptions<SeasonEntity> = {
    where: { active: true },
  };
  private readonly findManyOptions: FindManyOptions<SeasonEntity> = this
    .findOneOptions;

  async find(): Promise<SeasonEntity[]> {
    return await this.seasonRepository.find(this.findManyOptions);
  }

  async findOne(id: number): Promise<SeasonEntity> | undefined {
    return await this.seasonRepository.findOne(id, this.findOneOptions);
  }

  async findOneOrFail(id: number): Promise<SeasonEntity> {
    return await this.seasonRepository.findOneOrFail(id, this.findOneOptions);
  }

  async save(
    seasonInputData: SeasonInputData,
  ): Promise<SeasonEntity> | undefined {
    try {
      const seasonEntity = new SeasonEntity(seasonInputData);
      return await this.seasonRepository.save(seasonEntity);
    } catch (exception) {
      throw new BadRequestException(`${exception.name}: ${exception.message}`);
    }
  }
}
