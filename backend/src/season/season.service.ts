import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common'
import { SeasonEntity } from './season.entity'
import { type SeasonInputData } from './season-input.interface'
import { Repository, type FindManyOptions, type FindOneOptions } from 'typeorm'
import { ScoreService } from '../score/score.service'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class SeasonService {
  constructor (
    @InjectRepository(SeasonEntity) private readonly seasonRepository: Repository<SeasonEntity>,

    @Inject(forwardRef(() => ScoreService))
    private readonly scoreService: ScoreService
  ) {}

  private readonly findOneOptions: FindOneOptions<SeasonEntity> = {
    join: {
      alias: 'season',
      leftJoinAndSelect: {
        tournaments: 'season.tournaments',
        tournamentsGroups: 'tournaments.groups',
        groupsMatches: 'tournamentsGroups.matches',
        matchesPlayers: 'groupsMatches.matchPlayers',
        score: 'season.score'
      }
    },
    where: { active: true }
  }

  private readonly findManyOptions: FindManyOptions<SeasonEntity> = this
    .findOneOptions

  async find (): Promise<SeasonEntity[]> {
    return await this.seasonRepository.find(this.findManyOptions)
  }

  async findOne (id: number): Promise<SeasonEntity | null> {
    return await this.seasonRepository.findOne({ where: { id }, ...this.findOneOptions })
  }

  async findOneOrFail (id: number): Promise<SeasonEntity> {
    return await this.seasonRepository.findOneOrFail({ where: { id }, ...this.findOneOptions })
  }

  async save (
    seasonInputData: SeasonInputData
  ): Promise<SeasonEntity | undefined> {
    try {
      const scoreEntity =
        typeof seasonInputData.score === 'number'
          ? await this.scoreService.findOneOrFail(seasonInputData.score)
          : undefined
      const seasonEntity = new SeasonEntity(seasonInputData, scoreEntity)
      return await this.seasonRepository.save(seasonEntity)
    } catch (exception) {
      Logger.error(exception)
      throw new BadRequestException()
    }
  }
}
