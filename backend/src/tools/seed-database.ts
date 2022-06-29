import { Injectable, Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from '../config/config.typeorm';
import { SeasonEntity } from '../season/season.entity';
import * as Faker from 'faker';
import { SeasonRepository } from '../season/season.repository';
import { TournamentEntity } from '../tournament/tournament.entity';
import { GroupEntity } from '../group/group.entity';
import { MatchEntity } from '../match/match.entity';
import { MatchPlayerEntity } from '../match-player/match-player.entity';
import { ScoreEntity } from '../score/score.entity';
import { ScoreRepository } from '../score/score.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { GroupRepository } from '../group/group.repository';
import { MatchRepository } from '../match/match.repository';
import { MatchPlayerRepository } from '../match-player/match-player.repository';

@Injectable()
class SeedDatabaseService {
  constructor(
    private scoreRepository: ScoreRepository,
    private seasonRepository: SeasonRepository,
    private tournamentRepository: TournamentRepository,
    private groupRepository: GroupRepository,
    private matchRepository: MatchRepository,
    private playerRepository: MatchPlayerRepository,
  ) {}

  private countAsSequence(count: number): number[] {
    return Array.from({ length: count }, (_, k) => k + 1);
  }

  private randomActive(): boolean {
    return Faker.datatype.number(100) < 99;
  }

  private randomHexString(count: number): string {
    return Faker.datatype
      .hexaDecimal(count)
      .slice(2)
      .toLowerCase();
  }

  private async generateScore(): Promise<ScoreEntity> {
    Logger.log('Generating Score');

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
      seasons: null,
    };

    return await this.scoreRepository.save(score);
  }

  private async generateSeasons(
    score: ScoreEntity,
    count: number,
  ): Promise<SeasonEntity[]> {
    Logger.log('Generating Seasons');

    const ids = this.countAsSequence(count);

    const seasons = ids.map(id => {
      const start = Faker.date.past(5);
      const end = Faker.date.recent(30, start);
      const season: SeasonEntity = {
        id,
        active: this.randomActive(),
        start,
        end,
        name: `Kanaliiga Apex Season ${id}`,
        tournaments: null,
        score,
      };
      return season;
    });

    return await this.seasonRepository.save(seasons);
  }

  private async generateTournaments(
    seasons: SeasonEntity[],
    count: number,
  ): Promise<TournamentEntity[]> {
    Logger.log('Generating Tournaments');

    const ids = this.countAsSequence(count);

    const tournaments = seasons.flatMap(season => {
      return ids.map(localId => {
        const id = (season.id - 1) * count + localId;
        const start = Faker.date.between(season.start, season.end);
        const tournament: TournamentEntity = {
          id,
          active: this.randomActive(),
          start,
          name: `Kanaliiga Apex Season ${season.id} Game Day ${localId}`,
          groups: null,
          season,
          token: `S${season.id}_Day${localId}`,
        };
        return tournament;
      });
    });

    return await this.tournamentRepository.save(tournaments);
  }

  private async generateGroups(
    tournaments: TournamentEntity[],
    count: number,
  ): Promise<GroupEntity[]> {
    Logger.log('Generating Groups');

    const ids = this.countAsSequence(count);

    const groups = tournaments.flatMap(tournament => {
      return ids.map(localId => {
        const id = (tournament.id - 1) * count + localId;
        const group: GroupEntity = {
          id,
          active: this.randomActive(),
          order: localId,
          matches: null,
          tournament,
        };
        return group;
      });
    });

    return await this.groupRepository.save(groups);
  }

  private async generateMatches(
    groups: GroupEntity[],
    count: number,
  ): Promise<MatchEntity[]> {
    Logger.log('Generating Matches');

    const ids = this.countAsSequence(count);

    const matches = groups.flatMap(group => {
      const token = `a${this.randomHexString(7)}-${this.randomHexString(22)}`;
      return ids.map(localId => {
        const id = (group.id - 1) * count + localId;
        const start = Faker.date.past(5);
        const match: MatchEntity = {
          id,
          active: this.randomActive(),
          index: localId,
          token,
          group,
          start,
          matchPlayers: null,
        };
        return match;
      });
    });

    return await this.matchRepository.save(matches);
  }

  private async generatePlayers(
    matches: MatchEntity[],
    count: number,
  ): Promise<MatchPlayerEntity[]> {
    Logger.log('Generating Players');

    const ids = this.countAsSequence(count);

    const teamNames = this.countAsSequence(count / 3).map(() =>
      Faker.company.companyName(),
    );
    const prePlayers = ids.map(id => {
      const teamNum = 1 + Math.floor((id - 1) / 3);
      const player: Partial<MatchPlayerEntity> = {
        active: this.randomActive(),
        name: Faker.name.firstName(),
        teamNum,
        teamName: teamNames[teamNum - 1],
      };
      return player;
    });

    const players = matches.flatMap(match => {
      return prePlayers.map((prePlayer, index) => {
        const id = (match.id - 1) * count + (index + 1);
        const damage = Faker.datatype.number(Faker.datatype.number(6) * 400);
        const shots = Faker.datatype.number(Faker.datatype.number(15) * 10);
        const hits = Faker.datatype.number(shots);
        const characterNames = [
          'valkyrie',
          'lifeline',
          'bangalore',
          'gibraltar',
          'revenant',
          'octane',
          'mirage',
          'wraith',
          'caustic',
        ];
        const player: MatchPlayerEntity = {
          id,
          active: this.randomActive(),
          damage,
          kills:
            (damage >= 2500
              ? Faker.datatype.number(12)
              : damage >= 1500
              ? Faker.datatype.number(4)
              : 0) + Faker.datatype.number(8),
          assists:
            (damage >= 2500
              ? Faker.datatype.number(6)
              : damage >= 1500
              ? Faker.datatype.number(3)
              : 0) + Faker.datatype.number(15),
          survivalTime:
            (damage >= 2500 ? 1300 : damage >= 1500 ? 900 : 0) +
            Faker.datatype.number(700),
          teamPlacement: prePlayer.teamNum,
          name: prePlayer.name,
          teamName: prePlayer.teamName,
          teamNum: prePlayer.teamNum,
          hits: Faker.datatype.number(shots),
          characterName: Faker.random.arrayElement(characterNames),
          revivesGiven: Faker.datatype.number(5),
          knockdowns: Faker.datatype.number(hits / 3),
          respawnsGiven: Faker.datatype.number(5),
          headshots: Faker.datatype.number(hits),
          shots: shots,
          match,
        };
        return player;
      });
    });

    return await this.playerRepository.save(players, { chunk: 50 });
  }

  async generate() {
    const score = await this.generateScore();
    const seasons = await this.generateSeasons(score, 5);
    const tournaments = await this.generateTournaments(seasons, 4);
    const groups = await this.generateGroups(tournaments, 1);
    const matches = await this.generateMatches(groups, 4);
    await this.generatePlayers(matches, 60);
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
        ScoreEntity,
      ],
      logging: false,
    }),
    TypeOrmModule.forFeature([ScoreRepository]),
    TypeOrmModule.forFeature([SeasonRepository]),
    TypeOrmModule.forFeature([TournamentRepository]),
    TypeOrmModule.forFeature([GroupRepository]),
    TypeOrmModule.forFeature([MatchRepository]),
    TypeOrmModule.forFeature([MatchPlayerRepository]),
  ],
  providers: [SeedDatabaseService],
})
class SeedDatabaseModule {}

async function bootstrap() {
  try {
    Faker.seed(1);
    Faker.setLocale('fi');
    const app = await NestFactory.createApplicationContext(SeedDatabaseModule, {
      abortOnError: true,
    });
    try {
      Logger.log('Seeding database:');
      const seedDatabaseService = app.get(SeedDatabaseService);
      await seedDatabaseService.generate();
    } catch (e) {
      Logger.error(`${e.name} ${e.message}`);
      if (e.stackTrace) {
        Logger.error(`${e.stackTrace}`);
      }
    }
    await app.close();
  } catch (e) {
    Logger.error(`${e.name} ${e.message}`);
    if (e.stackTrace) {
      Logger.error(`${e.stackTrace}`);
    }
  }
}

bootstrap();
