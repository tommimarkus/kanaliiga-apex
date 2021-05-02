import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TournamentEntity } from './tournament.entity';
import { TournamentInputData } from './tournament-input.interface';
import { TournamentRepository } from './tournament.repository';
import { ScoreService } from '../score/score.service';
import { SeasonService } from '../season/season.service';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class TournamentService {
  constructor(
    private tournamentRepository: TournamentRepository,

    @Inject(forwardRef(() => ScoreService))
    private scoreService: ScoreService,

    @Inject(forwardRef(() => SeasonService))
    private seasonService: SeasonService,
  ) {}

  private readonly findOneOptions: FindOneOptions<TournamentEntity> = {
    join: {
      alias: 'tournament',
      leftJoinAndSelect: {
        season: 'tournament.season',
        groups: 'tournament.groups',
        groupsMatches: 'groups.matches',
        matchesPlayers: 'groupsMatches.matchPlayers',
        score: 'tournament.score',
      },
    },
    where: { active: true },
  };
  private readonly findManyOptions: FindOneOptions<TournamentEntity> = {
    ...this.findOneOptions,
    join: undefined,
  };

  async find(): Promise<TournamentEntity[]> {
    return await this.tournamentRepository.find(this.findManyOptions);
  }

  async findOne(id: number): Promise<TournamentEntity> | undefined {
    return await this.tournamentRepository.findOne(id, this.findOneOptions);
  }

  async findOneOrFail(id: number): Promise<TournamentEntity> {
    return await this.tournamentRepository.findOneOrFail(
      id,
      this.findOneOptions,
    );
  }

  async save(
    token: string,
    tournamentInputData: TournamentInputData,
  ): Promise<TournamentEntity> | undefined {
    try {
      const seasonEntity = await this.seasonService.findOneOrFail(
        tournamentInputData.season,
      );
      const scoreEntity =
        typeof tournamentInputData.score === 'number'
          ? await this.scoreService.findOneOrFail(tournamentInputData.score)
          : undefined;

      const tournamentEntity = new TournamentEntity(
        token,
        tournamentInputData,
        seasonEntity,
        scoreEntity,
      );
      return await this.tournamentRepository.save(tournamentEntity);
    } catch (exception) {
      const message = `${exception.name}: ${exception.message}`;
      Logger.error(`${message} ${exception.stack}`);
      throw new BadRequestException(message);
    }
  }
}
