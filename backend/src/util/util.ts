import { MatchEntity } from '../match/match.entity';
import {
  MatchResultOutputData,
  MatchResultTeamMemberOutputData,
} from '../match/match.interface';

export const matchEntityToMatchResultsOutput = (
  matchEntity: MatchEntity,
): MatchResultOutputData[] => {
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
        currentResult.teamDamage = currentResult.teamDamage + curr.damage;
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
          teamDamage: curr.damage,
          teamName: curr.teamName,
          teamNum: curr.teamNum,
          teamPlacement: curr.teamPlacement,
        } as MatchResultOutputData);
      }
      return prev;
    },
    [],
  );
};
