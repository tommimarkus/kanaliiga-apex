import { Injectable } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { MatchOutputOneData } from '../match/match.interface';
import { matchEntityToMatchResultsOutput } from '../util/util';
import { GroupEntity } from './group.entity';
import {
  GroupInputData,
  GroupOutputOneData,
  GroupOutputListData,
} from './group.interface';
import { GroupRepository } from './group.repository';
import { SeasonOutputData } from '../season/season.interface';

@Injectable()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async find(): Promise<GroupOutputListData[]> {
    const groupEntities = await this.groupRepository.find({
      select: ['id', 'active', 'name', 'start', 'tournament'],
      where: { active: true },
    });
    return groupEntities.map(
      groupEntity =>
        ({
          id: groupEntity.id,
          active: groupEntity.active,
          name: groupEntity.name,
          start: groupEntity.start && formatISO(groupEntity.start),
          tournament: {
            id: groupEntity.tournament?.id,
            active: groupEntity.tournament?.active,
            start:
              groupEntity.tournament?.start &&
              formatISO(groupEntity.tournament?.start),
            name: groupEntity.tournament?.name,
          } as SeasonOutputData,
        } as GroupOutputListData),
    );
  }

  async findOne(id: number): Promise<GroupOutputOneData> | undefined {
    const groupEntity = await this.groupRepository.findOne(id, {
      join: {
        alias: 'group',
        innerJoinAndSelect: {
          season: 'group.season',
        },
      },
      where: { active: true },
    });
    const result = groupEntity
      ? ({
          id: groupEntity.id,
          active: groupEntity.active,
          name: groupEntity.name,
          start: groupEntity.start && formatISO(groupEntity.start),
          tournament: {
            id: groupEntity.tournament?.id,
            active: groupEntity.tournament?.active,
            start:
              groupEntity.tournament?.start &&
              formatISO(groupEntity.tournament?.start),
            name: groupEntity.tournament?.name,
          } as SeasonOutputData,
          matches: groupEntity.matches.map(matchEntity => {
            const results = matchEntityToMatchResultsOutput(matchEntity);
            return {
              id: matchEntity.id,
              active: matchEntity.active,
              start: matchEntity.start && formatISO(matchEntity.start),
              results,
            } as MatchOutputOneData;
          }),
        } as GroupOutputOneData)
      : undefined;
    return result;
  }

  async save(
    token: string,
    groupInputData: GroupInputData,
  ): Promise<GroupOutputOneData> | undefined {
    const groupEntity = new GroupEntity(token, groupInputData);
    const savedGroupEntity = await this.groupRepository.save(groupEntity);

    const groupOutputData = {
      id: groupEntity.id,
      active: groupEntity.active,
      name: savedGroupEntity.name,
      matches: groupEntity.matches.map(matchEntity => {
        const results = matchEntityToMatchResultsOutput(matchEntity);
        return {
          id: matchEntity.id,
          active: matchEntity.active,
          start: matchEntity.start && formatISO(matchEntity.start),
          results,
        } as MatchOutputOneData;
      }),
    } as GroupOutputOneData;

    return groupOutputData;
  }
}
