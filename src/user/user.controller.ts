import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserDto } from './userDto/updateUserDto';
import { CreateUserDto } from './userDto/createUserDto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BaseUsersResponse } from './userDto/baseUsersResponse';
import { BaseUserResponse } from './userDto/baseUserResponse';
import { DeleteUserResponse } from './userDto/deleteUserResponse';
import JwtAuthGuard from '../auth/jwt/jwt.auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {
    this.userService = userService;
  }

  @Get('list')
  @ApiOkResponse({ description: '성공', type: BaseUsersResponse })
  @ApiOperation({
    summary: '전체 유저 리스트 조회 API',
    description: '전체 유저 리스트 받아온다.',
  })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/login/:id')
  @ApiOkResponse({ description: '성공', type: BaseUserResponse })
  @ApiOperation({
    summary: '특정 유저 로그인 처리 API',
    description: '특정 id 유저 가지고 온다.',
  })
  async login(
    @Param('id', ParseIntPipe) id: number,
    @Res() res,
  ): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get(':id')
  @ApiOkResponse({ description: '성공', type: BaseUserResponse })
  @ApiOperation({
    summary: '특정 유저 가지고 오는 API',
    description: '특정 id 유저 가지고 온다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get('localuser/:id')
  @ApiOkResponse({ description: '성공', type: BaseUserResponse })
  @ApiOperation({
    summary: '특정 로컬유저 가지고 오는 API(Test 용도)',
  })
  async findLocalUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findLocalUser(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: '성공', type: BaseUserResponse })
  @ApiOperation({
    summary: '특정 유저 정보 수정하는 API',
    description: '특정 id 유저 정보를 수정한다.',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, user);
  }

  @Post()
  @ApiOkResponse({ description: '성공', type: BaseUserResponse })
  @ApiOperation({
    summary: '유저 정보 받아서 유저 생성하는 API',
    description: '유저 생성한다.',
  })
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.createUser(user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '유저 id 받아서 유저 삭제하는 API',
    description: '유저 삭제한다.',
  })
  @ApiOkResponse({ description: '성공', type: DeleteUserResponse })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteUserResponse> {
    await this.userService.deleteUser(id);
    return Object.assign({
      id: id,
      statusCode: 200,
      statusMsg: `deleted successfully`,
    });
  }
}
