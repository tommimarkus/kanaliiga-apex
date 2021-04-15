import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('season')
export class ScoreEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
