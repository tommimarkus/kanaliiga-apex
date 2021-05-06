import { EntityRepository, Repository } from 'typeorm';
import { MatchPlayerEntity } from './match-player.entity';

@EntityRepository(MatchPlayerEntity)
export class MatchPlayerRepository extends Repository<MatchPlayerEntity> {}
