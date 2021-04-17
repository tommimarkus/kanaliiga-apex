import { ApiProperty } from '@nestjs/swagger';
import { GroupEntity } from './group.entity';

export class GroupData {
  @ApiProperty({
    nullable: false,
    example: 1,
  })
  order: number;

  constructor(entity?: GroupEntity) {
    if (entity) {
      this.order = entity.order;
    }
  }
}

export class GroupInputData extends GroupData {
  @ApiProperty({ nullable: false, example: 1 })
  tournament: number;

  constructor(entity?: GroupEntity) {
    super(entity);

    if (entity) {
      this.tournament = entity.tournament.id;
    }
  }
}
