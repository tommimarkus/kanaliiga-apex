import { type TournamentOutputListData } from '../tournament/tournament-output-list.interface'
import { type GroupData } from './group.interface'

export interface GroupOutputData extends GroupData {
  id: number
  active: boolean
  tournament: TournamentOutputListData
}
