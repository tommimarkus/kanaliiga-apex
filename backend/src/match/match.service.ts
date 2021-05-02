import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
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
      leftJoinAndSelect: {
        matchPlayers: 'match.matchPlayers',
        group: 'match.group',
        groupTournament: 'group.tournament',
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
    Logger.debug(JSON.stringify(this.findManyOptions));
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
        matchesData.matches.map(async (matchData, index) => {
          const matchEntity = new MatchEntity({
            token,
            matchData,
            group: groupEntity,
            index,
          });
          const existingMatchEntity = await this.matchRepository.findOne({
            select: ['id', 'token', 'index'],
            where: { token, index },
          });
          if (existingMatchEntity) {
            matchEntity.id = existingMatchEntity.id;
          }
          return await this.matchRepository.save(matchEntity);
        }),
      );
    } catch (exception) {
      const message = `${exception.name}: ${exception.message}`;
      Logger.error(`${message} ${exception.stack}`);
      throw new BadRequestException(message);
    }
  }

  async saveJSON(
    file: Express.Multer.File,
    token: string,
    group?: number,
  ): Promise<MatchEntity[]> | undefined {
    return await this.save(
      token,
      JSON.parse(file.buffer.toString()) as EAMatchesData,
      group,
    );
  }
}
