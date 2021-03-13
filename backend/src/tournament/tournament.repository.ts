import { EntityRepository, Repository } from 'typeorm';
import { TournamentEntity } from './tournament.entity';

@EntityRepository(TournamentEntity)
export class TournamentRepository extends Repository<TournamentEntity> {}
