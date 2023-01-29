import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../user/user.module'
import { AuthService } from './auth.service'
import { BasicAuthStrategy } from './basic-auth.strategy'

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, BasicAuthStrategy]
})
export class AuthModule {}
