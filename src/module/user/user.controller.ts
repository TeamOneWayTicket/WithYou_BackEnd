import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';
import { Auth } from '../../decorator/http.decorator';
import { Role } from '../../common/enum/role.enum';
import { UserParam } from '../../decorator/user.decorator';
import { UserPushTokenDto } from './dto/user-push-token.dto';
import { FamilyResponseDto } from '../family/dto/family-response.dto';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('join')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: FamilyResponseDto })
  @ApiOperation({
    summary: 'get invite-code',
    description: '유저의 가족에 초대할 수 있는 초대 코드 발급',
  })
  async joinFamily(
    @UserParam() user: User,
    @Query('code') code: string,
  ): Promise<User> {
    return this.userService.joinFamily(user.familyId, code);
  }

  @Post('push-token')
  @Auth(Role.User)
  @ApiOperation({ description: '사용자의 FCM 푸시토큰을 저장하는 API' })
  async saveUserPushToken(
    @UserParam() user: User,
    @Body() dto: UserPushTokenDto,
  ) {
    return await this.userService.saveUserPushToken(user.id, dto.token);
  }

  @Get(':id')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'getUserById',
    description: '특정 id 유저 가지고 온다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'updateUser',
    description: '특정 id 유저 정보를 수정한다.',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, dto);
  }

  @Post()
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'createUser',
    description: '유저 생성한다.',
  })
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'deleteUser',
    description: '유저 삭제한다.',
  })
  @ApiOkResponse({ description: '성공', type: DeleteUserResponseDto })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteUserResponseDto> {
    return { affected: await this.userService.deleteUser(id) };
  }
}
