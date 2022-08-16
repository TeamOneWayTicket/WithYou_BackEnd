import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BaseUserResponse } from '../user/userDto/baseUserResponse';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './familyDto/create-family.dto';
import { Family } from './family.entity';

@Controller('family')
export class FamilyController {
  constructor(
    private readonly userService: UserService,
    private readonly familyService: FamilyService,
  ) {}

  @Get(':familyId')
  @ApiOkResponse({ description: '성공', type: BaseUserResponse })
  @ApiOperation({
    summary: 'get FamilyMembers By FamilyId',
    description: 'familyId 로 해당 가족에 속한 유저들 가지고 온다.',
  })
  async findFamilyMember(
    @Param('familyId', ParseIntPipe) familyId: number,
  ): Promise<User[]> {
    return await this.userService.findByFamilyId(familyId);
  }

  @Post(':familyId')
  @ApiOperation({
    summary: 'create Family ',
    description: '가족 이름으로 가족 만든다',
  })
  async createFamily(@Body() family: CreateFamilyDto): Promise<Family> {
    return await this.familyService.createFamily(family);
  }
}
