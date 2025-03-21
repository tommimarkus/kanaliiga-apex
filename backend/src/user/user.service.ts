import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
  constructor (@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async findOne (username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { username } })
  }
}
