import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TournamentEntity } from './tournament.entity';
import { TournamentInputData } from './tournament-input.interface';
import { TournamentRepository } from './tournament.repository';
import { ScoreService } from '../score/score.service';
import { SeasonService } from '../season/season.service';
import { GroupService } from '../group/group.service';

@Injectable()
export class TournamentService {
  constructor(
    private tournamentRepository: TournamentRepository,

    @Inject(forwardRef(() => ScoreService))
    private scoreService: ScoreService,

    @Inject(forwardRef(() => SeasonService))
    private seasonService: SeasonService,

    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService,
  ) {}

  async find(): Promise<TournamentEntity[]> {
    return await this.tournamentRepository.find({
      select: ['id', 'active', 'name', 'start', 'season'],
      where: { active: true },
    });
  }

  async findOne(id: number): Promise<TournamentEntity> | undefined {
    return await this.tournamentRepository.findOne(id, {
      join: {
        alias: 'tournament',
        innerJoinAndSelect: {
          season: 'tournament.season',
        },
      },
      where: { active: true },
    });
  }

  async save(
    token: string,
    tournamentInputData: TournamentInputData,
  ): Promise<TournamentEntity> | undefined {
    let tournamentEntity: TournamentEntity;
    try {
      tournamentEntity = new TournamentEntity(token, tournamentInputData);
    } catch (exception) {
      throw new BadRequestException(`${exception.name}: ${exception.message}`);
    }

    const groups = await Promise.all(
      tournamentInputData.groups.map(
        async groupInputData => await this.groupService.save(groupInputData),
      ),
    );
    if (!groups || groups.length < 1) {
      throw new BadRequestException(
        `Groups with input ${JSON.stringify(
          tournamentInputData.groups,
        )} could not be created!`,
      );
    }

    const season = await this.seasonService.findOne(tournamentInputData.season);
    if (!season) {
      throw new BadRequestException(
        `Season with id ${tournamentInputData.season} not found!`,
      );
    }
    tournamentEntity.season = season;

    const scoreEntity = await this.scoreService.findOrCreateOne(
      tournamentInputData.score,
    );
    if (!scoreEntity) {
      throw new BadRequestException(
        `Score with id ${tournamentInputData.score} not found!`,
      );
    }
    tournamentEntity.score = scoreEntity;

    return await this.tournamentRepository.save(tournamentEntity);
  }
}
