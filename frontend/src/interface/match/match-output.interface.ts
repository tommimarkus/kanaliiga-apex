import { TournamentOutputData } from '../tournament/tournament-output.interface';
import { MatchData } from './match.interface';

export interface MatchOutputData extends MatchData {
  id: number;
  active: boolean;
  tournament?: TournamentOutputData;
}
