import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { EAMatchesData } from '../ea-match-data/ea-match-data.interface';
import { MatchEntity } from './match.entity';
import { MatchRepository } from './match.repository';
import { FindManyOptions, FindOneOptions, IsNull, Not } from 'typeorm';
import { GroupService } from '../group/group.service';

@Injectable()
export class MatchService {
  constructor(
    private matchRepository: MatchRepository,
    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService,
  ) {}

  private readonly findOneOptions: FindOneOptions<MatchEntity> = {
    join: {
      alias: 'match',
      innerJoinAndSelect: {
        group: 'match.group',
      },
    },
    where: { start: Not(IsNull()), active: true },
  };
  private readonly findManyOptions: FindManyOptions<MatchEntity> = {
    ...this.findOneOptions,
    order: { start: 'DESC' },
    take: 24,
  };

  async find(): Promise<MatchEntity[]> {
    return await this.matchRepository.find(this.findManyOptions);
  }

  async findOne(id: number): Promise<MatchEntity> | undefined {
    return await this.matchRepository.findOne(id, this.findOneOptions);
  }

  async findOneOrFail(id: number): Promise<MatchEntity> {
    return await this.matchRepository.findOneOrFail(id, this.findOneOptions);
  }

  async save(
    token: string,
    matchesData: EAMatchesData,
    group?: number,
  ): Promise<MatchEntity[]> | undefined {
    try {
      const groupEntity =
        group !== undefined
          ? await this.groupService.findOneOrFail(group)
          : undefined;
      return await Promise.all(
        matchesData.matches.map(async matchData => {
          const matchEntity = new MatchEntity({
            token,
            matchData,
            group: groupEntity,
          });
          const existingMatchEntity = await this.matchRepository.findOne({
            select: ['id', 'token'],
            where: { token },
          });
          if (existingMatchEntity) {
            matchEntity.id = existingMatchEntity.id;
          }
          return await this.matchRepository.save(matchEntity);
        }),
      );
    } catch (exception) {
      throw new BadRequestException(`${exception.name}: ${exception.message}`);
    }
  }

  async saveJSON(
    file: Express.Multer.File,
    token: string,
  ): Promise<MatchEntity[]> | undefined {
    return await this.save(
      token,
      JSON.parse(file.buffer.toString()) as EAMatchesData,
    );
  }
}
