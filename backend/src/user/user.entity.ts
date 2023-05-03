import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from '../auth/role.constant'

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Index()
  @Column({ nullable: false })
    username: string

  @Column({ nullable: false })
    passwordHash: string

  @Index()
  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
    array: true
  })
    roles: Role
}
