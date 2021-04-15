import { EntityRepository, Repository } from 'typeorm';
import { ScoreEntity } from './score.entity';

@EntityRepository(ScoreEntity)
export class ScoreRepository extends Repository<ScoreEntity> {}
