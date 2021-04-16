import { Injectable } from '@nestjs/common';
import { GroupEntity } from './group.entity';
import { GroupInputData } from './group-input.interface';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async find(): Promise<GroupEntity[]> {
    return await this.groupRepository.find({
      where: { active: true },
    });
  }

  async findOne(id: number): Promise<GroupEntity> | undefined {
    return await this.groupRepository.findOne(id, {
      join: {
        alias: 'group',
        innerJoinAndSelect: {
          season: 'group.season',
        },
      },
      where: { active: true },
    });
  }

  async save(groupInputData: GroupInputData): Promise<GroupEntity> | undefined {
    const groupEntity = new GroupEntity(groupInputData);
    return await this.groupRepository.save(groupEntity);
  }
}
