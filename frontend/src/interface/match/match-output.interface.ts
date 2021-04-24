import { GroupOutputData } from '../group/group-output.interface';
import { MatchData } from './match.interface';

export interface MatchOutputData extends MatchData {
  id: number;
  active: boolean;
  group?: GroupOutputData;
}
