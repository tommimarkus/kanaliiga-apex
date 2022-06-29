import { Injectable, Logger } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { MatchResultTeamMemberOutputData } from '../match/match-output.interface';
import { MatchPlayerEntity } from './match-player.entity';
import { MatchPlayerRepository } from './match-player.repository';

@Injectable()
export class MatchPlayerService {
  constructor(private matchPlayerRepository: MatchPlayerRepository) {}

  async find(): Promise<MatchResultTeamMemberOutputData[]> {
    const qb = this.matchPlayerRepository
      .createQueryBuilder('player')
      .select('COALESCE(SUM(player.kills), 0)', 'total_kills')
      .addSelect('COALESCE(SUM(player.damage), 0)', 'total_damage')
      .addSelect('COALESCE(SUM(player.assists), 0)', 'total_assists')
      .addSelect('COALESCE(SUM(player.survivalTime), 0)', 'total_survival_time')
      .addSelect('player.name', 'player_name')
      .addSelect('ARRAY_AGG(player.id)', 'player_id')
      .groupBy('player_name')
      .orderBy('total_kills', 'DESC')
      .addOrderBy('total_damage', 'DESC')
      .addOrderBy('total_assists', 'DESC');
    Logger.debug(qb.getSql());
    return (await qb.getRawMany()).map(rawData => {
      const outputData: MatchResultTeamMemberOutputData = {
        name: rawData.player_name,
        kills: rawData.total_kills,
        damage: rawData.total_damage,
        assists: rawData.total_assists,
        survivalTime: rawData.total_survival_time,
      };
      return outputData;
    });
  }

  resultsQuery(id: number): SelectQueryBuilder<MatchPlayerEntity> {
    return this.matchPlayerRepository
      .createQueryBuilder('player')
      .select('COALESCE(SUM(player.kills), 0)', 'total_kills')
      .addSelect('COALESCE(SUM(player.damage), 0)', 'total_damage')
      .addSelect('COALESCE(SUM(player.assists), 0)', 'total_assists')
      .addSelect('COALESCE(MIN(player.teamPlacement), 20)', 'best_placement')
      .addSelect('player."teamNum"', 'team_num')
      .addSelect('player."matchId"', 'match_id')
      .where('player."matchId" = :id', { id })
      .groupBy('team_num')
      .addGroupBy('match_id');
  }
}
