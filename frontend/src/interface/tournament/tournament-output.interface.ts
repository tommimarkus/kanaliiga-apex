import { SeasonOutputData } from '../season/season-output.interface';
import { TournamentData } from './tournament.interface';

export interface TournamentOutputData extends TournamentData {
  id: number;
  active: boolean;
  season?: SeasonOutputData;
}
