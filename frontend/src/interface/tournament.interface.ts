import { MatchOutputData } from './match.interface';

export interface TournamentData {
  name?: string;
  start?: string;
}

export interface TournamentOutputData extends TournamentData {
  id: number;
  matches: MatchOutputData[];
}

export interface TournamentOutputListData extends TournamentData {
  id: number;
}

export interface TournamentInputData extends TournamentData {
  matchTokens: string[];
}
