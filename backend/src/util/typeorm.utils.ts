import { type FindOptionsWhere, type FindOneOptions } from 'typeorm'

export const addWhere = <T>(options: FindOneOptions<T>, optionWhere: FindOptionsWhere<T>): FindOneOptions<T> => {
  return {
    ...options,
    where: { ...optionWhere, ...options.where }
  }
}
