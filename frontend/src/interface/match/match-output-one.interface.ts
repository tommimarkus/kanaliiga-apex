import { MatchOutputData } from './match-output.interface';
import { MatchResultOutputData } from './match-result-output.interface';

export interface MatchOutputOneData extends MatchOutputData {
  results: MatchResultOutputData[];
}
