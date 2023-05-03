import { Injectable, Logger, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm'
import typeormConfig from '../config/config.typeorm'
import { SeasonEntity } from '../season/season.entity'
import { faker } from '@faker-js/faker'
import { TournamentEntity } from '../tournament/tournament.entity'
import { GroupEntity } from '../group/group.entity'
import { MatchEntity } from '../match/match.entity'
import { MatchPlayerEntity } from '../match-player/match-player.entity'
import { ScoreEntity } from '../score/score.entity'
import { Repository } from 'typeorm'

@Injectable()
class SeedDatabaseService {
  constructor (
    @InjectRepository(ScoreEntity) private readonly scoreRepository: Repository<ScoreEntity>,
    @InjectRepository(SeasonEntity) private readonly seasonRepository: Repository<SeasonEntity>,
    @InjectRepository(TournamentEntity) private readonly tournamentRepository: Repository<TournamentEntity>,
    @InjectRepository(GroupEntity) private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(MatchEntity) private readonly matchRepository: Repository<MatchEntity>,
    @InjectRepository(MatchPlayerEntity) private readonly playerRepository: Repository<MatchPlayerEntity>
  ) {}

  private countAsSequence (count: number): number[] {
    return Array.from({ length: count }, (_, k) => k + 1)
  }

  private randomActive (): boolean {
    return faker.datatype.number(100) < 99
  }

  private randomHexString (count: number): string {
    return faker.datatype
      .hexadecimal({
        length: count,
        prefix: '',
        case: 'lower'
      })
  }

  private async generateScore (): Promise<ScoreEntity> {
    Logger.log('Generating Score')

    const score: ScoreEntity = {
      id: 1,
      kill: 1,
      placement1: 12,
      placement2: 9,
      placement3: 7,
      placement4: 5,
      placement5: 4,
      placement6: 3,
      placement7: 3,
      placement8: 2,
      placement9: 2,
      placement10: 2,
      placement11: 1,
      placement12: 1,
      placement13: 1,
      placement14: 1,
      placement15: 1,
      placement16: 0,
      placement17: 0,
      placement18: 0,
      placement19: 0,
      placement20: 0,
      seasons: undefined
    }

    return await this.scoreRepository.save(score)
  }

  private async generateSeasons (
    score: ScoreEntity,
    count: number
  ): Promise<SeasonEntity[]> {
    Logger.log('Generating Seasons')

    const ids = this.countAsSequence(count)

    const seasons = ids.map(id => {
      const start = faker.date.past(5)
      const end = faker.date.soon(30, start)
      const season: SeasonEntity = {
        id,
        active: this.randomActive(),
        start,
        end,
        name: `Kanaliiga Apex Season ${id}`,
        tournaments: undefined,
        score
      }
      return season
    })

    return await this.seasonRepository.save(seasons)
  }

  private async generateTournaments (
    seasons: SeasonEntity[],
    count: number
  ): Promise<TournamentEntity[]> {
    Logger.log('Generating Tournaments')

    const ids = this.countAsSequence(count)

    const tournaments = seasons.flatMap(season => {
      return ids.map(localId => {
        const id = (season.id - 1) * count + localId
        const start = faker.date.between(season.start, season.end)
        const tournament: TournamentEntity = {
          id,
          active: this.randomActive(),
          start,
          name: `Kanaliiga Apex Season ${season.id} Game Day ${localId}`,
          groups: undefined,
          season,
          token: `S${season.id}_Day${localId}`
        }
        return tournament
      })
    })

    return await this.tournamentRepository.save(tournaments)
  }

  private async generateGroups (
    tournaments: TournamentEntity[],
    count: number
  ): Promise<GroupEntity[]> {
    Logger.log('Generating Groups')

    const ids = this.countAsSequence(count)

    const groups = tournaments.flatMap(tournament => {
      return ids.map(localId => {
        const id = (tournament.id - 1) * count + localId
        const group: GroupEntity = {
          id,
          active: this.randomActive(),
          order: localId,
          matches: undefined,
          tournament
        }
        return group
      })
    })

    return await this.groupRepository.save(groups)
  }

  private async generateMatches (
    groups: GroupEntity[],
    count: number
  ): Promise<MatchEntity[]> {
    Logger.log('Generating Matches')

    const ids = this.countAsSequence(count)

    const matches = groups.flatMap(group => {
      const token = `a${this.randomHexString(7)}-${this.randomHexString(22)}`
      return ids.map(localId => {
        const id = (group.id - 1) * count + localId
        const start = faker.date.past(5)
        const match: MatchEntity = {
          id,
          active: this.randomActive(),
          index: localId,
          token,
          group,
          start,
          aimAssistAllowed: faker.datatype.boolean(),
          mapName: faker.music.songName(),
          matchPlayers: undefined
        }
        return match
      })
    })

    return await this.matchRepository.save(matches)
  }

  private async generatePlayers (
    matches: MatchEntity[],
    count: number
  ): Promise<MatchPlayerEntity[]> {
    Logger.log('Generating Players')

    const ids = this.countAsSequence(count)

    const teamNames = this.countAsSequence(count / 3).map(() =>
      faker.company.name()
    )
    const placements = faker.helpers.shuffle(Array.from(Array(20).keys()))
    const prePlayers = ids.map(id => {
      const teamNum = 1 + Math.floor((id - 1) / 3)
      const player: Partial<MatchPlayerEntity> = {
        active: this.randomActive(),
        name: faker.name.firstName(),
        teamNum,
        teamName: teamNames[teamNum - 1],
        teamPlacement: placements.indexOf(teamNum) + 1
      }
      return player
    })

    const players = matches.flatMap(match => {
      return prePlayers.map((prePlayer, index) => {
        const id = (match.id - 1) * count + (index + 1)
        const damage = faker.datatype.number(faker.datatype.number(15) * 250)
        const shots = faker.datatype.number(faker.datatype.number(15) * 10)
        const hits = faker.datatype.number(shots)
        const characterNames = [
          'valkyrie',
          'lifeline',
          'bangalore',
          'gibraltar',
          'revenant',
          'octane',
          'mirage',
          'wraith',
          'caustic'
        ]
        const damageOver2500 = damage >= 2500
        const damageOver1500 = damage >= 1500
        const player: MatchPlayerEntity = {
          id,
          active: this.randomActive(),
          damage,
          kills:
            (damageOver2500
              ? faker.datatype.number(8)
              : damageOver1500
                ? faker.datatype.number(3)
                : 0) + faker.datatype.number(3),
          assists:
            (damageOver2500
              ? faker.datatype.number(4)
              : damageOver1500
                ? faker.datatype.number(2)
                : 0) + faker.datatype.number(3),
          survivalTime:
            (damageOver2500 ? 1300 : damageOver1500 ? 900 : 0) +
            faker.datatype.number(700),
          teamPlacement: prePlayer.teamPlacement ?? 0,
          name: prePlayer.name ?? '',
          teamName: prePlayer.teamName ?? '',
          teamNum: prePlayer.teamNum ?? 0,
          hits: faker.datatype.number(shots),
          characterName: faker.helpers.arrayElement(characterNames),
          revivesGiven: faker.datatype.number(5),
          knockdowns: faker.datatype.number(hits / 3),
          respawnsGiven: faker.datatype.number(5),
          headshots: faker.datatype.number(hits),
          shots,
          match
        }
        return player
      })
    })

    return await this.playerRepository.save(players, { chunk: 50 })
  }

  async generate (): Promise<void> {
    const score = await this.generateScore()
    const seasons = await this.generateSeasons(score, 5)
    const tournaments = await this.generateTournaments(seasons, 4)
    const groups = await this.generateGroups(tournaments, 1)
    const matches = await this.generateMatches(groups, 4)
    await this.generatePlayers(matches, 60)
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeormConfig(),
      entities: [
        SeasonEntity,
        TournamentEntity,
        GroupEntity,
        MatchEntity,
        MatchPlayerEntity,
        ScoreEntity
      ],
      logging: false
    }),
    TypeOrmModule.forFeature([ScoreEntity]),
    TypeOrmModule.forFeature([SeasonEntity]),
    TypeOrmModule.forFeature([TournamentEntity]),
    TypeOrmModule.forFeature([GroupEntity]),
    TypeOrmModule.forFeature([MatchEntity]),
    TypeOrmModule.forFeature([MatchPlayerEntity])
  ],
  providers: [SeedDatabaseService]
})
class SeedDatabaseModule {}

async function bootstrap (): Promise<void> {
  try {
    faker.seed(1)
    faker.setLocale('fi')
    const app = await NestFactory.createApplicationContext(SeedDatabaseModule, {
      abortOnError: true
    })
    try {
      Logger.log('Seeding database:')
      const seedDatabaseService = app.get(SeedDatabaseService)
      await seedDatabaseService.generate()
    } catch (exception) {
      Logger.error(exception, exception.stack ?? exception.stackTrace)
    }
    await app.close()
  } catch (exception) {
    Logger.error(exception, exception.stack ?? exception.stackTrace)
  }
}

bootstrap().catch((reason: any) => { Logger.error(reason, reason.stack ?? reason.stackTrace) })
