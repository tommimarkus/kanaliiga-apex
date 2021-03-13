import { Injectable, Logger } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { MatchOutputData } from 'src/match/match.interface';
import { matchEntityToMatchResultsOutput } from '../util/util';
import { TournamentEntity } from './tournament.entity';
import {
  TournamentCSVData,
  TournamentData,
  TournamentInputData,
  TournamentOutputData,
  TournamentOutputListData,
} from './tournament.interface';
import { TournamentRepository } from './tournament.repository';
import { CsvParser } from 'nest-csv-parser';
import { Readable } from 'stream';

@Injectable()
export class TournamentService {
  constructor(
    private tournamentRepository: TournamentRepository,
    private readonly csvParser: CsvParser,
  ) {}

  async find(): Promise<TournamentOutputListData[]> {
    const tournamentEntities = await this.tournamentRepository.find({
      select: ['id', 'name'],
    });
    return tournamentEntities.map(
      tournamentEntity =>
        ({
          name: tournamentEntity.name,
          id: tournamentEntity.id,
        } as TournamentOutputListData),
    );
  }

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

  async saveCSV(
    file: Express.Multer.File,
    tournamentData: TournamentData,
  ): Promise<TournamentOutputData> | undefined {
    Logger.log(file.buffer.toString());

    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    const headerNames = ['token', 'activation', 'expiration', 'matchToken'];
    const tournamentCSVDatas: TournamentCSVData[] = (
      await this.csvParser.parse(stream, TournamentCSVData, null, null, {
        strict: true,
        separator: ',',
        mapHeaders: ({ _header, index }) =>
          index < headerNames.length ? headerNames[index] : null,
      })
    ).list;

    Logger.log(JSON.stringify(tournamentCSVDatas, null, 2));

    const token = tournamentCSVDatas[0].token;
    const tournamentInputData = {
      name: tournamentData.name,
      matchTokens: tournamentCSVDatas.map(
        tournamentCSVData => tournamentCSVData.matchToken,
      ),
    } as TournamentInputData;

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
