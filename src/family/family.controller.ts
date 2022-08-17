import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserResponseDto } from '../user/userDto/user-response.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './familyDto/create-family.dto';
import { Family } from './family.entity';
import { UpdateFamilyDto } from './familyDto/update-family.dto';
import { DeleteUserResponseDto } from '../user/userDto/delete-user-response.dto';
import { DeleteFamilyResponseDto } from './familyDto/delete-family-response.dto';

@Controller('family')
export class FamilyController {
  constructor(
    private readonly userService: UserService,
    private readonly familyService: FamilyService,
  ) {}

  @Get(':familyId')
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
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
    summary: 'create family ',
    description: '가족 이름으로 가족 만든다',
  })
  async createFamily(@Body() family: CreateFamilyDto): Promise<Family> {
    return await this.familyService.createFamily(family);
  }

  @Patch(':familyId')
  @ApiOperation({
    summary: 'update family',
    description: '가족 이름 변경',
  })
  async updateFamily(
    @Param('familyId', ParseIntPipe) familyId: number,
    @Body() familyName: UpdateFamilyDto,
  ): Promise<Family> {
    return await this.familyService.updateFamily(
      familyId,
      familyName.familyName,
    );
  }

  @Delete(':familyId')
  @ApiOperation({
    summary: 'delete family',
    description: '유저 삭제한다.',
  })
  @ApiOkResponse({ description: '성공', type: DeleteUserResponseDto })
  async deleteUser(
    @Param('familyId', ParseIntPipe) familyId: number,
  ): Promise<DeleteFamilyResponseDto> {
    await this.familyService.deleteFamily(familyId);
    return Object.assign({
      familyId: familyId,
      statusCode: 200,
      statusMsg: `deleted successfully`,
    });
  }
}
