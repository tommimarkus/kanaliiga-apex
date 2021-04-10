import { Injectable } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { matchEntityToMatchResultsOutput } from '../util/util';
import { EAMatchesData } from '../ea-match-data/ea-match-data.interface';
import { MatchEntity } from './match.entity';
import { MatchOutputOneData, MatchOutputListData } from './match.interface';
import { MatchRepository } from './match.repository';
import { IsNull, Not } from 'typeorm';
import { TournamentOutputData } from '../tournament/tournament.interface';

@Injectable()
export class MatchService {
  constructor(private matchRepository: MatchRepository) {}

  async find(): Promise<MatchOutputListData[]> {
    const matchEntities = await this.matchRepository.find({
      select: ['id', 'active', 'start', 'tournament'],
      join: {
        alias: 'match',
        innerJoinAndSelect: {
          tournament: 'match.tournament',
        },
      },
      where: { start: Not(IsNull()), active: true },
      order: { start: 'DESC' },
      take: 24,
    });
    return matchEntities.map(
      matchEntity =>
        ({
          id: matchEntity.id,
          active: matchEntity.active,
          start: formatISO(matchEntity.start),
          tournament: {
            id: matchEntity.tournament?.id,
            active: matchEntity.tournament?.active,
            name: matchEntity.tournament?.name,
            start:
              matchEntity.tournament?.start &&
              formatISO(matchEntity.tournament?.start),
          } as TournamentOutputData,
        } as MatchOutputListData),
    );
  }

  async findOne(id: number): Promise<MatchOutputOneData> | undefined {
    const matchEntity = await this.matchRepository.findOne(id, {
      join: {
        alias: 'match',
        innerJoinAndSelect: {
          tournament: 'match.tournament',
        },
      },
      where: { start: Not(IsNull()), active: true },
    });
    return matchEntity
      ? ({
          id: matchEntity.id,
          active: matchEntity.active,
          start: formatISO(matchEntity.start),
          tournament: {
            id: matchEntity.tournament?.id,
            active: matchEntity.tournament?.active,
            name: matchEntity.tournament?.name,
            start:
              matchEntity.tournament?.start &&
              formatISO(matchEntity.tournament?.start),
          } as TournamentOutputData,
          results: matchEntityToMatchResultsOutput(matchEntity),
        } as MatchOutputOneData)
      : undefined;
  }

  async save(
    token: string,
    matchesData: EAMatchesData,
  ): Promise<MatchOutputOneData[]> | undefined {
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
        active: matchEntity.active,
        start: formatISO(matchEntity.start),
        tournament: {
          id: matchEntity.tournament?.id,
          active: matchEntity.tournament?.active,
          name: matchEntity.tournament?.name,
          start:
            matchEntity.tournament?.start &&
            formatISO(matchEntity.tournament?.start),
        } as TournamentOutputData,
        results,
      } as MatchOutputOneData;
    });

    return matchOutputDatas;
  }

  async saveJSON(
    file: Express.Multer.File,
    token: string,
  ): Promise<MatchOutputOneData[]> | undefined {
    return await this.save(
      token,
      JSON.parse(file.buffer.toString()) as EAMatchesData,
    );
  }
}
