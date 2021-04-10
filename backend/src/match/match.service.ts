import { Injectable } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { matchEntityToMatchResultsOutput } from '../util/util';
import { EAMatchesData } from '../ea-match-data/ea-match-data.interface';
import { MatchEntity } from './match.entity';
import { MatchOutputData, MatchOutputListData } from './match.interface';
import { MatchRepository } from './match.repository';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(private matchRepository: MatchRepository) {}

  async find(): Promise<MatchOutputListData[]> {
    const matchEntities = await this.matchRepository.find({
      select: ['id', 'start', 'tournament'],
      join: {
        alias: 'match',
        innerJoinAndSelect: {
          tournament: 'match.tournament',
        },
      },
      where: { start: Not(IsNull()) },
    });
    return matchEntities.map(
      matchEntity =>
        ({
          id: matchEntity.id,
          start: formatISO(matchEntity.start),
          tournamentName: matchEntity.tournament?.name,
        } as MatchOutputListData),
    );
  }

  async findOne(id: number): Promise<MatchOutputData> | undefined {
    const matchEntity = await this.matchRepository.findOne(id);
    return matchEntity
      ? ({
          id: matchEntity.id,
          start: formatISO(matchEntity.start),
          results: matchEntityToMatchResultsOutput(matchEntity),
        } as MatchOutputData)
      : undefined;
  }

  async save(
    token: string,
    matchesData: EAMatchesData,
  ): Promise<MatchOutputData[]> | undefined {
    const savedMatchEntities = await Promise.all(
      matchesData.matches.map(async matchData => {
        const matchEntity = new MatchEntity(token, matchData);
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

    const matchOutputDatas = savedMatchEntities.map(matchEntity => {
      const results = matchEntityToMatchResultsOutput(matchEntity);
      return {
        id: matchEntity.id,
        start: formatISO(matchEntity.start),
        results,
      } as MatchOutputData;
    });

    return matchOutputDatas;
  }

  async saveJSON(
    file: Express.Multer.File,
    token: string,
  ): Promise<MatchOutputData[]> | undefined {
    return await this.save(
      token,
      JSON.parse(file.buffer.toString()) as EAMatchesData,
    );
  }
}
