import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody } from '@nestjs/swagger';
import { Role } from '../auth/role.constant';
import { Roles } from '../auth/role.decorator';
import { GroupInputData } from './group-input.interface';
import {
  GroupOutputOneData,
  GroupOutputListData,
} from './group-output.interface';
import { GroupService } from './group.service';

@ApiBasicAuth()
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  async list(): Promise<GroupOutputListData[]> {
    const groupEntities = await this.groupService.find();
    return groupEntities.map(
      groupEntity => new GroupOutputListData(groupEntity),
    );
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBody({ type: GroupInputData })
  async save(
    @Body() body: GroupInputData,
  ): Promise<GroupOutputOneData> | undefined {
    Logger.log(`save ${JSON.stringify(body, null, 2)}`);

    const savedGroupEntity = await this.groupService.save(body);
    return savedGroupEntity
      ? new GroupOutputOneData(savedGroupEntity)
      : undefined;
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GroupOutputOneData> | undefined {
    const groupEntity = await this.groupService.findOne(id);
    return groupEntity ? new GroupOutputOneData(groupEntity) : undefined;
  }
}
