import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
