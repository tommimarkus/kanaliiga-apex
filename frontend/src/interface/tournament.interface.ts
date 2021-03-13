import { MatchOutputData } from './match.interface';

export interface TournamentData {
  name?: string;
}

export interface TournamentOutputData extends TournamentData {
  matches: MatchOutputData[];
}

export interface TournamentInputData extends TournamentData {
  matchTokens: string[];
}
