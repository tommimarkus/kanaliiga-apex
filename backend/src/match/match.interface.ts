interface MatchResultTeamMemberOutputData {
    name: string;
    kills: number;
    assists: number;
    damage: number;
    survivalTime: number;
}

interface MatchResultOutputData {
    teamNum: number;
    teamName: string;
    teamPlacement: number;
    teamKills: number;
    teamPoints: number;
    teamMembers: MatchResultTeamMemberOutputData[];
}

interface MatchOutputData {
    start: Date;
    results: MatchResultOutputData[];
}