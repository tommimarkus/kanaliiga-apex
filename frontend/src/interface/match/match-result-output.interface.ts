import { type MatchResultTeamMemberOutputData } from './match-result-team-member-output.interface'

export interface MatchResultOutputData {
  teamNum: number
  teamName: string
  teamPlacement: number
  teamKills: number
  teamPoints: number
  teamMembers: MatchResultTeamMemberOutputData[]
  teamDamage: number
}
