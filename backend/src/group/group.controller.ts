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
import {
  GroupInputData,
  GroupOutputOneData,
  GroupOutputListData,
} from './group.interface';
import { GroupService } from './group.service';

@ApiBasicAuth()
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  async list(): Promise<GroupOutputListData[]> {
    return await this.groupService.find();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GroupOutputOneData> | undefined {
    return await this.groupService.findOne(id);
  }

  @Post(':token')
  @Roles(Role.ADMIN)
  @ApiBody({ type: GroupInputData })
  async save(
    @Param('token') token: string,
    @Body() body: GroupInputData,
  ): Promise<GroupOutputOneData> | undefined {
    Logger.log(`save ${token}: ${JSON.stringify(body, null, 2)}`);
    return await this.groupService.save(token, body);
  }
}
