export interface MatchResultTeamMemberOutputData {
  name: string;
  kills: number;
  assists: number;
  damage: number;
  survivalTime: number;
}

export interface MatchResultOutputData {
  teamNum: number;
  teamName: string;
  teamPlacement: number;
  teamKills: number;
  teamPoints: number;
  teamMembers: MatchResultTeamMemberOutputData[];
  teamDamage: number;
}

export interface MatchOutputData {
  start: string;
  results: MatchResultOutputData[];
}
