import { MatchOutputData } from './match.interface';

export interface TournamentData {
  name?: string;
  start: string;
}

export interface TournamentOutputData extends TournamentData {
  matches: MatchOutputData[];
}

export interface TournamentOutputListData extends TournamentData {
  id: number;
}

export interface TournamentInputData extends TournamentData {
  matchTokens: string[];
}
