import { MatchOutputOneData } from '../match/match-output-one.interface';
import { TournamentOutputData } from './tournament-output.interface';

export interface TournamentOutputOneData extends TournamentOutputData {
  matches: MatchOutputOneData[];
}
