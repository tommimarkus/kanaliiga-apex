import { BasicStrategy } from 'passport-http'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
  constructor (private readonly authService: AuthService) {
    super()
  }

  async validate (username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password)
    Logger.debug(user)
    if (user !== undefined) {
      return user
    }
    throw new UnauthorizedException()
  }
}
