import { type GroupOutputData } from '../group/group-output.interface'
import { type MatchData } from './match.interface'

export interface MatchOutputData extends MatchData {
  id: number
  active: boolean
  group?: GroupOutputData
}
