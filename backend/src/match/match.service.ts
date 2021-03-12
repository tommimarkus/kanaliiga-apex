import { Injectable } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { MatchEntity } from './match.entity';
import { MatchRepository } from './match.repository';

@Injectable()
export class MatchService {
  constructor(private matchRepository: MatchRepository) {}

  private entityToOutput(matchEntity: MatchEntity): MatchResultOutputData[] {
    const placementPoints = [
      12,
      9,
      7,
      5,
      4,
      3,
      3,
      2,
      2,
      2,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
    ];
    const killPoints = 1;

    return matchEntity.matchPlayers.reduce(
      (prev: MatchResultOutputData[], curr) => {
        const currentResult = prev.find(
          result => result.teamNum === curr.teamNum,
        );
        if (currentResult) {
          currentResult.teamPoints =
            currentResult.teamPoints + curr.kills * killPoints;
          currentResult.teamKills = currentResult.teamKills + curr.kills;
          currentResult.teamMembers.push({
            assists: curr.assists,
            damage: curr.damage,
            kills: curr.kills,
            name: curr.name,
            survivalTime: curr.survivalTime,
          } as MatchResultTeamMemberOutputData);
        } else {
          prev.push({
            teamPoints:
              placementPoints[curr.teamPlacement - 1] + curr.kills * killPoints,
            teamKills: curr.kills,
            teamMembers: [
              {
                assists: curr.assists,
                damage: curr.damage,
                kills: curr.kills,
                name: curr.name,
                survivalTime: curr.survivalTime,
              } as MatchResultTeamMemberOutputData,
            ],
            teamName: curr.teamName,
            teamNum: curr.teamNum,
            teamPlacement: curr.teamPlacement,
          } as MatchResultOutputData);
        }
        return prev;
      },
      [],
    );
  }

  async findOne(token: string): Promise<MatchOutputData> | undefined {
    const matchEntity = await this.matchRepository.findOne({
      where: { token },
    });
    return matchEntity
      ? ({ results: this.entityToOutput(matchEntity) } as MatchOutputData)
      : undefined;
  }

  async save(
    token: string,
    matchesData: EAMatchesData,
  ): Promise<MatchOutputData[]> | undefined {
    const savedMatchEntities = await Promise.all(
      matchesData.matches.map(async matchData => {
        const matchEntity = new MatchEntity(token, matchData);
        return await this.matchRepository.save(matchEntity);
      }),
    );

    const matchOutputDatas = savedMatchEntities.map(matchEntity => {
      const results = this.entityToOutput(matchEntity);
      return {
        start: matchEntity.start,
        results,
      } as MatchOutputData;
    });

    return matchOutputDatas;
  }
}
