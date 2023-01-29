import { type GroupOutputOneData } from '../group/group-output-one.interface'
import { type TournamentOutputData } from './tournament-output.interface'

export interface TournamentOutputOneData extends TournamentOutputData {
  groups: GroupOutputOneData[]
}
