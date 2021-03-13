import { Injectable } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { MatchOutputData } from 'src/match/match.interface';
import { matchEntityToMatchResultsOutput } from '../util/util';
import { TournamentEntity } from './tournament.entity';
import {
  TournamentInputData,
  TournamentOutputData,
} from './tournament.interface';
import { TournamentRepository } from './tournament.repository';

@Injectable()
export class TournamentService {
  constructor(private tournamentRepository: TournamentRepository) {}

  async findOne(id: number): Promise<TournamentOutputData> | undefined {
    const tournamentEntity = await this.tournamentRepository.findOne(id);
    return tournamentEntity
      ? ({
          name: tournamentEntity.name,
          matches: tournamentEntity.matches.map(matchEntity => {
            const results = matchEntityToMatchResultsOutput(matchEntity);
            return {
              start: matchEntity.start && formatISO(matchEntity.start),
              results,
            } as MatchOutputData;
          }),
        } as TournamentOutputData)
      : undefined;
  }

  async save(
    token: string,
    tournamentInputData: TournamentInputData,
  ): Promise<TournamentOutputData> | undefined {
    const tournamentEntity = new TournamentEntity(token, tournamentInputData);
    const savedTournamentEntity = await this.tournamentRepository.save(
      tournamentEntity,
    );

    const tournamentOutputData = {
      name: savedTournamentEntity.name,
      matches: tournamentEntity.matches.map(matchEntity => {
        const results = matchEntityToMatchResultsOutput(matchEntity);
        return {
          start: matchEntity.start && formatISO(matchEntity.start),
          results,
        } as MatchOutputData;
      }),
    } as TournamentOutputData;

    return tournamentOutputData;
  }
}
