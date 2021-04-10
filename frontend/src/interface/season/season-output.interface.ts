import { SeasonData } from './season.interface';

export interface SeasonOutputData extends SeasonData {
  id: number;
  active: boolean;
}
