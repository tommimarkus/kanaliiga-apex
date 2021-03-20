import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { matchEntityToMatchResultsOutput } from '../util/util';
import { EAMatchData, EAMatchesData } from '../ea-match-data/ea-match-data.interface';
import { MatchEntity } from './match.entity';
import {
  MatchResultOutputData,
  MatchResultTeamMemberOutputData,
  MatchOutputData,
} from './match.interface';
import { MatchRepository } from './match.repository';
import { TournamentEntity } from 'src/tournament/tournament.entity';
import { TournamentCSVData, TournamentInputData, TournamentOutputData } from 'src/tournament/tournament.interface';
import { Readable } from 'stream';

@Injectable()
export class MatchService {
  constructor(private matchRepository: MatchRepository) {}

  async findOne(id: number): Promise<MatchOutputData> | undefined {
    const matchEntity = await this.matchRepository.findOne(id);
    return matchEntity
      ? ({
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
    return await this.save(token, JSON.parse(file.buffer.toString()) as EAMatchesData);
  }
}
