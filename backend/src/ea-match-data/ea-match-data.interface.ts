interface EAMatchPlayerResult {
    kills: number;
    damageDealt: number;
    playerName: string;
    survivalTime: number;
    teamPlacement: number;
    teamName: string;
    teamNum: number;
    assists: number;
}

interface EAMatchData {
    match_start: number;
    player_results: EAMatchPlayerResult[];
}

interface EAMatchesData {
    matches: EAMatchData[];
}