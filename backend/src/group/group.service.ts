import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common'
import { GroupEntity } from './group.entity'
import { type GroupInputData } from './group-input.interface'
import { TournamentService } from '../tournament/tournament.service'
import { Repository, type FindManyOptions, type FindOneOptions, type FindOptionsWhere } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { addWhere } from 'src/util/typeorm.utils'

@Injectable()
export class GroupService {
  constructor (
    @InjectRepository(GroupEntity) private readonly groupRepository: Repository<GroupEntity>,

    @Inject(forwardRef(() => TournamentService))
    private readonly tournamentService: TournamentService
  ) {}

  private readonly findOneOptions: FindOneOptions<GroupEntity> = {
    join: {
      alias: 'group',
      leftJoinAndSelect: {
        tournament: 'group.tournament',
        matches: 'group.matches'
      }
    },
    where: { active: true }
  }

  private readonly findManyOptions: FindManyOptions<GroupEntity> = {
    where: { active: true }
  }

  async find (): Promise<GroupEntity[]> {
    return await this.groupRepository.find({
      where: { active: true }
    })
  }

  async findOne (id: number): Promise<GroupEntity | null> {
    const where: FindOptionsWhere<GroupEntity> = { id }
    return await this.groupRepository.findOne(addWhere(this.findOneOptions, where))
  }

  async findOneOrFail (id: number): Promise<GroupEntity> {
    const where: FindOptionsWhere<GroupEntity> = { id }
    return await this.groupRepository.findOneOrFail(addWhere(this.findOneOptions, where))
  }

  async save (groupInputData: GroupInputData): Promise<GroupEntity | undefined> {
    try {
      const tournamentEntity = await this.tournamentService.findOneOrFail(
        groupInputData.tournament
      )
      const groupEntity = new GroupEntity(groupInputData, tournamentEntity)
      return await this.groupRepository.save(groupEntity)
    } catch (exception) {
      Logger.error(exception)
      throw new BadRequestException()
    }
  }
}
