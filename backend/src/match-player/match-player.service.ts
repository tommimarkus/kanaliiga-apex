import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, type SelectQueryBuilder } from 'typeorm'
import { type MatchResultTeamMemberOutputData } from '../match/match-output.interface'
import { MatchPlayerEntity } from './match-player.entity'

@Injectable()
export class MatchPlayerService {
  constructor (@InjectRepository(MatchPlayerEntity) private readonly matchPlayerRepository: Repository<MatchPlayerEntity>) {}

  async find (): Promise<MatchResultTeamMemberOutputData[]> {
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
      .addOrderBy('total_assists', 'DESC')
    return (await qb.getRawMany()).map(rawData => {
      const outputData: MatchResultTeamMemberOutputData = {
        name: rawData.player_name,
        kills: rawData.total_kills,
        damage: rawData.total_damage,
        assists: rawData.total_assists,
        survivalTime: rawData.total_survival_time
      }
      return outputData
    })
  }

  resultsQuery (matchId: number): SelectQueryBuilder<MatchPlayerEntity> {
    return this.matchPlayerRepository
      .createQueryBuilder('player')
      .select('COALESCE(SUM(player.kills), 0)', 'total_kills')
      .addSelect('COALESCE(SUM(player.damage), 0)', 'total_damage')
      .addSelect('COALESCE(SUM(player.assists), 0)', 'total_assists')
      .addSelect('COALESCE(MIN(player.teamPlacement), 20)', 'best_placement')
      .addSelect('player."teamNum"', 'team_num')
      .addSelect('player."matchId"', 'match_id')
      .where('player."matchId" = :matchId', { matchId })
      .groupBy('team_num')
      .addGroupBy('match_id')
  }

  async findTopKillsByMatchId (matchId: number, limit: number): Promise<MatchResultTeamMemberOutputData[]> {
    const qb = this.topQuery(matchId, limit).addOrderBy('total_kills', 'DESC')
    return (await qb.getRawMany()).map(rawData => this.asOutput(rawData))
  }

  async findTopDamageByMatchId (matchId: number, limit: number): Promise<MatchResultTeamMemberOutputData[]> {
    const qb = this.topQuery(matchId, limit).addOrderBy('total_damage', 'DESC')
    return (await qb.getRawMany()).map(rawData => this.asOutput(rawData))
  }

  async findTopAssistsByMatchId (matchId: number, limit: number): Promise<MatchResultTeamMemberOutputData[]> {
    const qb = this.topQuery(matchId, limit).addOrderBy('total_assists', 'DESC')
    return (await qb.getRawMany()).map(rawData => this.asOutput(rawData))
  }

  private topQuery (matchId: number, limit: number): SelectQueryBuilder<MatchPlayerEntity> {
    return this.resultsQuery(matchId)
      .addSelect('player.name', 'player_name')
      .addGroupBy('player_name')
      .limit(limit)
  }

  private asOutput (rawData: any): MatchResultTeamMemberOutputData {
    return {
      name: rawData.player_name,
      kills: rawData.total_kills,
      damage: rawData.total_damage,
      assists: rawData.total_assists,
      survivalTime: rawData.total_survival_time
    }
  }
}
