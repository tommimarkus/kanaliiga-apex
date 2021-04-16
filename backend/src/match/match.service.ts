import { Injectable } from '@nestjs/common';
import { EAMatchesData } from '../ea-match-data/ea-match-data.interface';
import { MatchEntity } from './match.entity';
import { MatchRepository } from './match.repository';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(private matchRepository: MatchRepository) {}

  async find(): Promise<MatchEntity[]> {
    return await this.matchRepository.find({
      select: ['id', 'active', 'start', 'group'],
      join: {
        alias: 'match',
        innerJoinAndSelect: {
          group: 'match.group',
        },
      },
      where: { start: Not(IsNull()), active: true },
      order: { start: 'DESC' },
      take: 24,
    });
  }

  async findOne(id: number): Promise<MatchEntity> | undefined {
    return await this.matchRepository.findOne(id, {
      join: {
        alias: 'match',
        innerJoinAndSelect: {
          group: 'match.group',
        },
      },
      where: { start: Not(IsNull()), active: true },
    });
  }

  async save(
    token: string,
    matchesData: EAMatchesData,
  ): Promise<MatchEntity[]> | undefined {
    return await Promise.all(
      matchesData.matches.map(async matchData => {
        const matchEntity = new MatchEntity({ token, matchData });
        const existingMatchEntity = await this.matchRepository.findOne({
          select: ['id', 'token'],
          where: { token },
        });
        if (existingMatchEntity) {
          matchEntity.id = existingMatchEntity.id;
        }
        return await this.matchRepository.save(matchEntity);
      }),
    );
  }

  async saveJSON(
    file: Express.Multer.File,
    token: string,
  ): Promise<MatchEntity[]> | undefined {
    return await this.save(
      token,
      JSON.parse(file.buffer.toString()) as EAMatchesData,
    );
  }
}
