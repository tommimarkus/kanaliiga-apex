import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common'
import { TournamentEntity } from './tournament.entity'
import { type TournamentInputData } from './tournament-input.interface'
import { SeasonService } from '../season/season.service'
import { Repository, type FindOneOptions } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class TournamentService {
  constructor (
    @InjectRepository(TournamentEntity) private readonly tournamentRepository: Repository<TournamentEntity>,

    @Inject(forwardRef(() => SeasonService))
    private readonly seasonService: SeasonService
  ) {}

  private readonly findOneOptions: FindOneOptions<TournamentEntity> = {
    join: {
      alias: 'tournament',
      leftJoinAndSelect: {
        season: 'tournament.season',
        groups: 'tournament.groups',
        groupsMatches: 'groups.matches',
        matchesPlayers: 'groupsMatches.matchPlayers'
      }
    },
    where: { active: true }
  }

  private readonly findManyOptions: FindOneOptions<TournamentEntity> = {
    ...this.findOneOptions,
    join: undefined
  }

  async find (): Promise<TournamentEntity[]> {
    return await this.tournamentRepository.find(this.findManyOptions)
  }

  async findOne (id: number): Promise<TournamentEntity | null> {
    return await this.tournamentRepository.findOne({ where: { id }, ...this.findOneOptions })
  }

  async findOneOrFail (id: number): Promise<TournamentEntity> {
    return await this.tournamentRepository.findOneOrFail({ where: { id }, ...this.findOneOptions })
  }

  async save (
    token: string,
    tournamentInputData: TournamentInputData
  ): Promise<TournamentEntity | undefined> {
    try {
      if (typeof tournamentInputData.season !== 'number') {
        throw new BadRequestException()
      }
      const seasonEntity = await this.seasonService.findOneOrFail(
        tournamentInputData.season
      )
      const tournamentEntity = new TournamentEntity(
        token,
        tournamentInputData,
        seasonEntity
      )
      return await this.tournamentRepository.save(tournamentEntity)
    } catch (exception) {
      Logger.error(exception)
      throw new BadRequestException()
    }
  }
}
