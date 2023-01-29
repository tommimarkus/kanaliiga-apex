import { Injectable, Logger } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor (private readonly userService: UserService) {}

  async validateUser (username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username)
    Logger.debug(JSON.stringify(user))
    return (user != null) && bcrypt.compareSync(password, user.passwordHash)
      ? { roles: user.roles }
      : undefined
  }
}
