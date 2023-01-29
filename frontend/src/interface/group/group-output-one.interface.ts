import { type MatchOutputOneData } from '../match/match-output-one.interface'
import { type GroupOutputData } from './group-output.interface'

export interface GroupOutputOneData extends GroupOutputData {
  matches: MatchOutputOneData[]
}
