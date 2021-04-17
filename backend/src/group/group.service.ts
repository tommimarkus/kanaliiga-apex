import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GroupEntity } from './group.entity';
import { GroupInputData } from './group-input.interface';
import { GroupRepository } from './group.repository';
import { TournamentService } from '../tournament/tournament.service';
import { FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    private groupRepository: GroupRepository,

    @Inject(forwardRef(() => TournamentService))
    private tournamentService: TournamentService,
  ) {}

  private readonly findOneOptions: FindOneOptions<GroupEntity> = {
    join: {
      alias: 'group',
      innerJoinAndSelect: {
        season: 'group.season',
      },
    },
    where: { active: true },
  };
  private readonly findManyOptions: FindManyOptions<GroupEntity> = {
    ...this.findOneOptions,
    join: undefined,
  };

  async find(): Promise<GroupEntity[]> {
    return await this.groupRepository.find({
      where: { active: true },
    });
  }

  async findOne(id: number): Promise<GroupEntity> | undefined {
    return await this.groupRepository.findOne(id, this.findOneOptions);
  }

  async findOneOrFail(id: number): Promise<GroupEntity> {
    return await this.groupRepository.findOneOrFail(id, this.findOneOptions);
  }

  async save(groupInputData: GroupInputData): Promise<GroupEntity> | undefined {
    try {
      const tournamentEntity = await this.tournamentService.findOneOrFail(
        groupInputData.tournament,
      );
      const groupEntity = new GroupEntity(groupInputData, tournamentEntity);
      return await this.groupRepository.save(groupEntity);
    } catch (exception) {
      throw new BadRequestException(`${exception.name}: ${exception.message}`);
    }
  }
}
