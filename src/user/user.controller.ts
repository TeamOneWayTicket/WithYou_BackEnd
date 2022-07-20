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
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserDto } from './userDto/updateUserDto';
import { CreateUserDto } from './userDto/createUserDto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {
    this.userService = userService;
  }

  @Get('list')
  @ApiOperation({
    summary: '전체 유저 리스트 조회 API',
    description: '전체 유저 리스트 받아온다.',
  })
  async findAll(): Promise<User[]> {
    const userList = await this.userService.findAll();
    return Object.assign({
      data: userList,
      statusCode: 200,
      statusMsg: '유저 조회 성공적',
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const foundUser = await this.userService.findOne(+id);

    return Object.assign({
      data: foundUser,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Get('localuser/:id')
  async findLocalUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const foundUser = await this.userService.findLocalUser(id);

    return Object.assign({
      data: foundUser,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, user);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    const savedUser = await this.userService.createUser(user);
    return Object.assign({
      data: { savedUser },
      statusCode: 200,
      statusMsg: `saved successfully`,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    await this.userService.deleteUser(id);
    return Object.assign({
      data: { userId: id },
      statusCode: 200,
      statusMsg: `deleted successfully`,
    });
  }
}
