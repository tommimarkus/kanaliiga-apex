import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common'
import { type EAMatchesData } from '../ea-match-data/ea-match-data.interface'
import { MatchEntity } from './match.entity'
import { type FindManyOptions, type FindOneOptions, IsNull, Not, Repository, type FindOptionsWhere } from 'typeorm'
import { GroupService } from '../group/group.service'
import {
  type MatchOutputOneData,
  type MatchResultOutputData
} from './match-output.interface'
import { MatchPlayerEntity } from '../match-player/match-player.entity'
import { ScoreEntity } from '../score/score.entity'
import { MatchPlayerService } from '../match-player/match-player.service'
import { GroupEntity } from '../group/group.entity'
import { TournamentEntity } from '../tournament/tournament.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { addWhere } from 'src/util/typeorm.utils'

@Injectable()
export class MatchService {
  constructor (
    @InjectRepository(MatchEntity) private readonly matchRepository: Repository<MatchEntity>,
    @Inject(forwardRef(() => MatchPlayerService))
    private readonly matchPlayerService: MatchPlayerService,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService
  ) {}

  private readonly findOneOptions: FindOneOptions<MatchEntity> = {
    join: {
      alias: 'match',
      leftJoinAndSelect: {
        matchPlayers: 'match.matchPlayers',
        group: 'match.group',
        groupTournament: 'group.tournament'
      }
    },
    where: { start: Not(IsNull()), active: true }
  }

  private readonly findManyOptions: FindManyOptions<MatchEntity> = {
    ...this.findOneOptions,
    order: { start: 'DESC' },
    take: 24
  }

  async find (): Promise<MatchEntity[]> {
    return await this.matchRepository.find(this.findManyOptions)
  }

  async findOne (id: number): Promise<MatchOutputOneData | undefined> {
    const resultsQuery = this.matchPlayerService.resultsQuery(id)
    const qb = this.matchRepository
      .createQueryBuilder('match')
      .select('match.active', 'active')
      .addSelect('match.id', 'id')
      .addSelect('match.start', 'start')
      .addSelect(
        'results.placement_points + results.kill_points',
        'total_points'
      )
      .addSelect('tournament.id', 'tournament_id')
      .innerJoin(GroupEntity, 'group', 'group.id = match.group')
      .innerJoin(
        TournamentEntity,
        'tournament',
        'tournament.id = group.tournament'
      )
      .innerJoinAndSelect(
        resultsQueryBuilder => {
          return resultsQueryBuilder
            .select('team_names.team_name', 'team_name')
            .addSelect('team_results.team_num', 'team_num')
            .addSelect('team_results.total_kills', 'kills')
            .addSelect('team_results.total_assists', 'assists')
            .addSelect('team_results.total_damage', 'damage')
            .addSelect('team_results.match_id', 'match_id')
            .addSelect('team_results.best_placement', 'best_placement')
            .addSelect('team_results.total_kills * score.kill', 'kill_points')
            .addSelect(
              `CASE
                        WHEN team_results.best_placement = 1 THEN score.placement1
                        WHEN team_results.best_placement = 2 THEN score.placement2
                        WHEN team_results.best_placement = 3 THEN score.placement3
                        WHEN team_results.best_placement = 4 THEN score.placement4
                        WHEN team_results.best_placement = 5 THEN score.placement5
                        WHEN team_results.best_placement = 6 THEN score.placement6
                        WHEN team_results.best_placement = 7 THEN score.placement7
                        WHEN team_results.best_placement = 8 THEN score.placement8
                        WHEN team_results.best_placement = 9 THEN score.placement9
                        WHEN team_results.best_placement = 10 THEN score.placement10
                        WHEN team_results.best_placement = 11 THEN score.placement11
                        WHEN team_results.best_placement = 12 THEN score.placement12
                        WHEN team_results.best_placement = 13 THEN score.placement13
                        WHEN team_results.best_placement = 14 THEN score.placement14
                        WHEN team_results.best_placement = 15 THEN score.placement15
                        WHEN team_results.best_placement = 16 THEN score.placement16
                        WHEN team_results.best_placement = 17 THEN score.placement17
                        WHEN team_results.best_placement = 18 THEN score.placement18
                        WHEN team_results.best_placement = 19 THEN score.placement19
                        WHEN team_results.best_placement = 20 THEN score.placement20
                        ELSE 0
                        END`,
              'placement_points'
            )
            .from(`(${resultsQuery.getQuery()})`, 'team_results')
            .setParameters(resultsQuery.getParameters())
            .innerJoin(
              teamNameSubQuery => {
                return teamNameSubQuery
                  .select('player."teamNum"', 'team_num')
                  .addSelect('MIN(player.teamName)', 'team_name')
                  .addSelect('player."matchId"', 'match_id')
                  .from(MatchPlayerEntity, 'player')
                  .where('player."matchId" = :id', { id })
                  .groupBy('team_num')
                  .addGroupBy('match_id')
              },
              'team_names',
              'team_names.team_num = team_results.team_num'
            )
            .innerJoin(ScoreEntity, 'score', 'score.id = 1')
        },
        'results',
        'match.id = match_id'
      )
      .orderBy('total_points', 'DESC')
      .addOrderBy('kills', 'DESC')
      .addOrderBy('damage', 'DESC')
      .addOrderBy('assists', 'DESC')

    const rawResults = await qb.getRawMany()

    if (
      rawResults !== undefined &&
      rawResults !== null &&
      rawResults.length > 0
    ) {
      const first = rawResults[0]
      const results: MatchOutputOneData = {
        active: first.active,
        id: first.id,
        group: {
          id: 1,
          active: true,
          order: 1,
          tournament: { id: first.tournament_id, active: true, name: '' }
        },
        start: first.start,
        results: rawResults.map(rawResultData => {
          const outputResult: MatchResultOutputData = {
            teamNum: rawResultData.team_num,
            teamName: rawResultData.team_name,
            teamPlacement: rawResultData.best_placement,
            teamKills: rawResultData.kills,
            teamDamage: rawResultData.damage,
            teamPoints: rawResultData.total_points,
            teamMembers: []
          }
          return outputResult
        })
      }

      return results
    }

    return undefined
  }

  async findOneOrFail (id: number): Promise<MatchEntity> {
    const where: FindOptionsWhere<MatchEntity> = { id }
    return await this.matchRepository.findOneOrFail(addWhere(this.findOneOptions, where))
  }

  async save (
    token: string,
    matchesData: EAMatchesData,
    group?: number
  ): Promise<MatchEntity[] | undefined> {
    try {
      const groupEntity =
        group !== undefined
          ? await this.groupService.findOneOrFail(group)
          : undefined
      return await Promise.all(
        matchesData.matches.map(async (matchData, index) => {
          const matchEntity = new MatchEntity({
            token,
            matchData,
            group: groupEntity,
            index
          })
          const existingMatchEntity = await this.matchRepository.findOne({
            select: ['id', 'token', 'index'],
            where: { token, index }
          })
          if (existingMatchEntity != null) {
            matchEntity.id = existingMatchEntity.id
          }
          return await this.matchRepository.save(matchEntity)
        })
      )
    } catch (exception) {
      Logger.error(exception)
      throw new BadRequestException()
    }
  }

  async saveJSON (
    file: Express.Multer.File,
    token: string,
    group?: number
  ): Promise<MatchEntity[] | undefined> {
    return await this.save(
      token,
      JSON.parse(file.buffer.toString()) as EAMatchesData,
      group
    )
  }
}
