import { Injectable } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { MatchOutputOneData } from '../match/match.interface';
import { matchEntityToMatchResultsOutput } from '../util/util';
import { SeasonEntity } from './season.entity';
import {
  SeasonInputData,
  SeasonOutputOneData,
  SeasonOutputListData,
} from './season.interface';
import { SeasonRepository } from './season.repository';
import { TournamentOutputOneData } from '../tournament/tournament.interface';

@Injectable()
export class SeasonService {
  constructor(private seasonRepository: SeasonRepository) {}

  async find(): Promise<SeasonOutputListData[]> {
    const seasonEntities = await this.seasonRepository.find({
      select: ['id', 'active', 'name', 'start', 'end'],
      where: { active: true },
    });
    return seasonEntities.map(
      seasonEntity =>
        ({
          id: seasonEntity.id,
          active: seasonEntity.active,
          name: seasonEntity.name,
          start: formatISO(seasonEntity.start),
          end: formatISO(seasonEntity.end),
        } as SeasonOutputListData),
    );
  }

  async findOne(id: number): Promise<SeasonOutputOneData> | undefined {
    const seasonEntity = await this.seasonRepository.findOne(id, {
      where: { active: true },
    });
    return seasonEntity
      ? ({
          id: seasonEntity.id,
          active: seasonEntity.active,
          name: seasonEntity.name,
          start: seasonEntity.start && formatISO(seasonEntity.start),
          end: seasonEntity.end && formatISO(seasonEntity.end),
          tournaments: seasonEntity.tournaments.map(tournamentEntity => {
            return {
              id: tournamentEntity.id,
              active: tournamentEntity.active,
              name: tournamentEntity.name,
              start:
                tournamentEntity.start && formatISO(tournamentEntity.start),
              matches: tournamentEntity.matches.map(matchEntity => {
                return {
                  start: matchEntity.start && formatISO(matchEntity.start),
                  results: matchEntityToMatchResultsOutput(matchEntity),
                } as MatchOutputOneData;
              }),
            } as TournamentOutputOneData;
          }),
        } as SeasonOutputOneData)
      : undefined;
  }

  async save(
    seasonInputData: SeasonInputData,
  ): Promise<SeasonOutputOneData> | undefined {
    const seasonEntity = new SeasonEntity(seasonInputData);
    const savedSeasonEntity = await this.seasonRepository.save(seasonEntity);

    const seasonOutputData = {
      id: savedSeasonEntity.id,
      active: savedSeasonEntity.active,
      name: savedSeasonEntity.name,
      start: savedSeasonEntity.start && formatISO(savedSeasonEntity.start),
      end: savedSeasonEntity.end && formatISO(savedSeasonEntity.end),
      tournaments: savedSeasonEntity.tournaments.map(tournamentEntity => {
        return {
          id: tournamentEntity.id,
          active: tournamentEntity.active,
          name: tournamentEntity.name,
          start: tournamentEntity.start && formatISO(tournamentEntity.start),
          matches: tournamentEntity.matches.map(matchEntity => {
            return {
              start: matchEntity.start && formatISO(matchEntity.start),
              results: matchEntityToMatchResultsOutput(matchEntity),
            } as MatchOutputOneData;
          }),
        } as TournamentOutputOneData;
      }),
    } as SeasonOutputOneData;

    return seasonOutputData;
  }
}
