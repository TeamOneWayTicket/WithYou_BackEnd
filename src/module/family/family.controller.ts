import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/service/user.service';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { Family } from './entity/family.entity';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { DeleteFamilyResponseDto } from './dto/delete-family-response.dto';
import { UsersResponseDto } from '../user/dto/users-response.dto';
import { FamilyResponseDto } from './dto/family-response.dto';
import { Auth } from '../../decorator/http.decorator';
import { Role } from '../../common/enum/role.enum';
import { UserParam } from '../../decorator/user.decorator';

@Controller('family')
export class FamilyController {
  constructor(
    private readonly userService: UserService,
    private readonly familyService: FamilyService,
  ) {}

  @Get()
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: UsersResponseDto })
  @ApiOperation({
    summary: 'get FamilyMembers By FamilyId',
    description: 'familyId 로 해당 가족에 속한 유저들 가지고 온다.',
  })
  async findFamilyMember(@UserParam() user: User): Promise<User[]> {
    return await this.userService.findByFamilyId(user.familyId);
  }

  @Post()
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: FamilyResponseDto })
  @ApiOperation({
    summary: 'create family ',
    description: '가족 이름으로 가족 만든다',
  })
  async createFamily(@Body() dto: CreateFamilyDto): Promise<Family> {
    return await this.familyService.createFamily(dto);
  }

  @Patch()
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: Family })
  @ApiOperation({
    summary: 'update family',
    description: '가족 이름 변경',
  })
  async updateFamily(
    @UserParam() user: User,
    @Body() dto: UpdateFamilyDto,
  ): Promise<Family> {
    return await this.familyService.updateFamily(user.familyId, dto.name);
  }

  @Delete()
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: DeleteFamilyResponseDto })
  @ApiOperation({
    summary: 'delete family information',
    description: '가족정보를 삭제한다.',
  })
  async deleteUser(@UserParam() user: User): Promise<DeleteFamilyResponseDto> {
    await this.familyService.deleteFamily(user.familyId);
    return {
      id: user.familyId,
      statusCode: 200,
      statusMsg: `deleted successfully`,
    };
  }
}
