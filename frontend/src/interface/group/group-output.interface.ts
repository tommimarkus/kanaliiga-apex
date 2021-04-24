import { TournamentOutputListData } from '../tournament/tournament-output-list.interface';
import { GroupData } from './group.interface';

export interface GroupOutputData extends GroupData {
  id: number;
  active: boolean;
  tournament: TournamentOutputListData;
}
