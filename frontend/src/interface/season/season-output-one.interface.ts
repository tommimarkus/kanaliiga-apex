import { TournamentOutputOneData } from '../tournament/tournament-output-one.interface';
import { SeasonOutputData } from './season-output.interface';

export interface SeasonOutputOneData extends SeasonOutputData {
  tournaments: TournamentOutputOneData[];
}
