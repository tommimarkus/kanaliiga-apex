import { type TournamentOutputOneData } from '../tournament/tournament-output-one.interface'
import { type SeasonOutputData } from './season-output.interface'

export interface SeasonOutputOneData extends SeasonOutputData {
  tournaments: TournamentOutputOneData[]
}
