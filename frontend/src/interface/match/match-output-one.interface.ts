import { type MatchOutputData } from './match-output.interface'
import { type MatchResultOutputData } from './match-result-output.interface'

export interface MatchOutputOneData extends MatchOutputData {
  results: MatchResultOutputData[]
}
