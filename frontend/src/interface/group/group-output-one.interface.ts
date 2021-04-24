import { MatchOutputOneData } from '../match/match-output-one.interface';
import { GroupOutputData } from './group-output.interface';

export interface GroupOutputOneData extends GroupOutputData {
  matches: MatchOutputOneData[];
}
