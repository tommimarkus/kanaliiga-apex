import { Injectable } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { MatchOutputOneData } from '../match/match.interface';
import { matchEntityToMatchResultsOutput } from '../util/util';
import { TournamentEntity } from './tournament.entity';
import {
  TournamentCSVData,
  TournamentData,
  TournamentInputData,
  TournamentOutputOneData,
  TournamentOutputListData,
} from './tournament.interface';
import { TournamentRepository } from './tournament.repository';
import { CsvParser } from 'nest-csv-parser';
import { Readable } from 'stream';
import { SeasonOutputData } from '../season/season.interface';

@Injectable()
export class TournamentService {
  constructor(
    private tournamentRepository: TournamentRepository,
    private readonly csvParser: CsvParser,
  ) {}

  async find(): Promise<TournamentOutputListData[]> {
    const tournamentEntities = await this.tournamentRepository.find({
      select: ['id', 'active', 'name', 'start', 'season'],
      where: { active: true },
    });
    return tournamentEntities.map(
      tournamentEntity =>
        ({
          id: tournamentEntity.id,
          active: tournamentEntity.active,
          name: tournamentEntity.name,
          start: tournamentEntity.start && formatISO(tournamentEntity.start),
          season: {
            id: tournamentEntity.season?.id,
            active: tournamentEntity.season?.active,
            start:
              tournamentEntity.season?.start &&
              formatISO(tournamentEntity.season?.start),
            end:
              tournamentEntity.season?.end &&
              formatISO(tournamentEntity.season?.end),
            name: tournamentEntity.season?.name,
          } as SeasonOutputData,
        } as TournamentOutputListData),
    );
  }

  async findOne(id: number): Promise<TournamentOutputOneData> | undefined {
    const tournamentEntity = await this.tournamentRepository.findOne(id, {
      relations: ['season'],
      where: { active: true },
    });
    return tournamentEntity
      ? ({
          id: tournamentEntity.id,
          active: tournamentEntity.active,
          name: tournamentEntity.name,
          start: tournamentEntity.start && formatISO(tournamentEntity.start),
          season: {
            id: tournamentEntity.season?.id,
            active: tournamentEntity.season?.active,
            start:
              tournamentEntity.season?.start &&
              formatISO(tournamentEntity.season?.start),
            end:
              tournamentEntity.season?.end &&
              formatISO(tournamentEntity.season?.end),
            name: tournamentEntity.season?.name,
          } as SeasonOutputData,
          matches: tournamentEntity.matches.map(matchEntity => {
            const results = matchEntityToMatchResultsOutput(matchEntity);
            return {
              id: matchEntity.id,
              active: matchEntity.active,
              start: matchEntity.start && formatISO(matchEntity.start),
              results,
            } as MatchOutputOneData;
          }),
        } as TournamentOutputOneData)
      : undefined;
  }

  async save(
    token: string,
    tournamentInputData: TournamentInputData,
  ): Promise<TournamentOutputOneData> | undefined {
    const tournamentEntity = new TournamentEntity(token, tournamentInputData);
    const savedTournamentEntity = await this.tournamentRepository.save(
      tournamentEntity,
    );

    const tournamentOutputData = {
      id: tournamentEntity.id,
      active: tournamentEntity.active,
      name: savedTournamentEntity.name,
      matches: tournamentEntity.matches.map(matchEntity => {
        const results = matchEntityToMatchResultsOutput(matchEntity);
        return {
          id: matchEntity.id,
          active: matchEntity.active,
          start: matchEntity.start && formatISO(matchEntity.start),
          results,
        } as MatchOutputOneData;
      }),
    } as TournamentOutputOneData;

    return tournamentOutputData;
  }

  async saveCSV(
    file: Express.Multer.File,
    tournamentData: TournamentData,
  ): Promise<TournamentOutputOneData> | undefined {
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    const headerNames = ['token', 'activation', 'expiration', 'matchToken'];
    const tournamentCSVDatas: TournamentCSVData[] = (
      await this.csvParser.parse(stream, TournamentCSVData, null, null, {
        strict: true,
        separator: ',',
        mapHeaders: ({ index }) =>
          index < headerNames.length ? headerNames[index] : null,
      })
    ).list;

    const token = tournamentCSVDatas[0].token;
    const tournamentInputData = {
      name: tournamentData.name,
      start: tournamentData.start,
      matchTokens: tournamentCSVDatas.map(tournamentCSVData =>
        tournamentCSVData.matchToken.trim(),
      ),
    } as TournamentInputData;

    const tournamentEntity = new TournamentEntity(token, tournamentInputData);
    const savedTournamentEntity = await this.tournamentRepository.save(
      tournamentEntity,
    );

    const tournamentOutputData = {
      id: tournamentEntity.id,
      active: tournamentEntity.active,
      name: savedTournamentEntity.name,
      matches: tournamentEntity.matches.map(matchEntity => {
        const results = matchEntityToMatchResultsOutput(matchEntity);
        return {
          id: matchEntity.id,
          active: matchEntity.active,
          start: matchEntity.start && formatISO(matchEntity.start),
          results,
        } as MatchOutputOneData;
      }),
    } as TournamentOutputOneData;

    return tournamentOutputData;
  }
}
