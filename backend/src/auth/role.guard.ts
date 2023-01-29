import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { type Role } from './role.constant'
import { ROLES_KEY } from './role.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor (private readonly reflector: Reflector) {}

  canActivate (context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (requiredRoles !== undefined) {
      const { user } = context.switchToHttp().getRequest()
      return requiredRoles.some(role => user.roles?.includes(role))
    }
    return false
  }
}
