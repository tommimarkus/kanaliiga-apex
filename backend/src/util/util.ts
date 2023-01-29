import { type MatchEntity } from '../match/match.entity'
import {
  type MatchResultOutputData,
  type MatchResultTeamMemberOutputData
} from '../match/match-output.interface'

export const matchEntityToMatchResultsOutput = (
  matchEntity: MatchEntity
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
    0
  ]
  const killPoints = 1

  return matchEntity.matchPlayers?.reduce(
    (prev: MatchResultOutputData[], curr) => {
      const currentResult = prev.find(
        result => result.teamNum === curr.teamNum
      )
      if (currentResult != null) {
        currentResult.teamPoints =
          currentResult.teamPoints + curr.kills * killPoints
        currentResult.teamKills = currentResult.teamKills + curr.kills
        currentResult.teamDamage = currentResult.teamDamage + curr.damage
        const teamMember: MatchResultTeamMemberOutputData = {
          assists: curr.assists,
          damage: curr.damage,
          kills: curr.kills,
          name: curr.name,
          survivalTime: curr.survivalTime
        }
        currentResult.teamMembers.push(teamMember)
      } else {
        const teamMember: MatchResultTeamMemberOutputData = {
          assists: curr.assists,
          damage: curr.damage,
          kills: curr.kills,
          name: curr.name,
          survivalTime: curr.survivalTime
        }
        const matchResult: MatchResultOutputData = {
          teamPoints:
            placementPoints[curr.teamPlacement - 1] + curr.kills * killPoints,
          teamKills: curr.kills,
          teamMembers: [
            teamMember
          ],
          teamDamage: curr.damage,
          teamName: curr.teamName,
          teamNum: curr.teamNum,
          teamPlacement: curr.teamPlacement
        }
        prev.push(matchResult)
      }
      return prev
    },
    []
  ) ?? []
}
