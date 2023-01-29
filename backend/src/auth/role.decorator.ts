import { applyDecorators, SetMetadata } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { type Role } from './role.constant'

export const ROLES_KEY = 'roles'
// eslint-disable-next-line @typescript-eslint/ban-types
export const Roles = (...roles: Role[]): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol | undefined, descriptor?: TypedPropertyDescriptor<Y> | undefined) => void => {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), ApiTags(...roles))
}
