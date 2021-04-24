import { GroupOutputOneData } from '../group/group-output-one.interface';
import { TournamentOutputData } from './tournament-output.interface';

export interface TournamentOutputOneData extends TournamentOutputData {
  groups: GroupOutputOneData[];
}
