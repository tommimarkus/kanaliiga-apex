import { EntityRepository, Repository } from 'typeorm';
import { GroupEntity } from './group.entity';

@EntityRepository(GroupEntity)
export class GroupRepository extends Repository<GroupEntity> {}
