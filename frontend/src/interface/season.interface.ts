import { TournamentOutputData } from './tournament.interface';

export interface SeasonData {
  start?: string;
  name: string;
}

export interface SeasonInputData extends SeasonData {}

export interface SeasonOutputData extends SeasonData {
  tournaments: TournamentOutputData[];
}

export interface SeasonOutputListData extends SeasonData {
  id: number;
}
