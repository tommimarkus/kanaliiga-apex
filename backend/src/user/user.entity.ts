import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../auth/role.constant';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
    array: true,
    default: [Role.USER],
  })
  roles: Role;
}
