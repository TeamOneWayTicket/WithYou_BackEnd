import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersResponseDto } from './dto/users-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from '../../decorator/http.decorator';
import { Role } from '../../common/enum/role.enum';
import { UserParam } from '../../decorator/user.decorator';
import { UserPushTokenDto } from './dto/user-push-token.dto';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {
    this.userService = userService;
  }

  @Get('list')
  @ApiOkResponse({ description: '성공', type: UsersResponseDto })
  @ApiOperation({
    summary: 'getAllUserList',
    description: '전체 유저 리스트 받아온다.',
  })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
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
  @UseGuards(AuthGuard('jwt'))
  @Get('/login/:id')
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'getUserById through jwt',
    description: '특정 id 유저 가지고 온다.',
  })
  async login(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get(':id')
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'getUserById',
    description: '특정 id 유저 가지고 온다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get('localuser/:id')
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'getLocalUserById (Test 용도)',
  })
  async findLocalUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findLocalUser(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'updateUser',
    description: '특정 id 유저 정보를 수정한다.',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, user);
  }

  @Post()
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'createUser',
    description: '유저 생성한다.',
  })
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.createUser(user);
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
    await this.userService.deleteUser(id);
    return Object.assign({
      id: id,
      statusCode: 200,
      statusMsg: `deleted successfully`,
    });
  }
}
