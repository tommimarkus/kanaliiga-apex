import { type TournamentData } from './tournament.interface'

export interface TournamentInputData extends TournamentData {
  matchTokens: string[]
}
