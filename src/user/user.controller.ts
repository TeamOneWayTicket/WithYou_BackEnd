import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { LocalUser } from '../entity/local.user.entity';
import { LocalUserService } from './local/local.user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly localUserService: LocalUserService,
  ) {
    this.userService = userService;
    this.localUserService = localUserService;
  }

  @Get('list')
  async findAll(): Promise<User[]> {
    const userList = await this.userService.findAll();
    return Object.assign({
      data: userList,
      statusCode: 200,
      statusMsg: '유저 조회 성공적',
    });
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const foundUser = await this.userService.findOne(+id);
    const foundLocalUser = await this.localUserService.findOne(1);
    console.log(foundUser.local_user);
    console.log(foundLocalUser.user_email);
    // console.log(foundUser.local_user.user_id);
    // console.log(foundUser.local_user.user_password);
    // console.log(foundUser.local_user.user_email);
    return Object.assign({
      data: foundUser,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Patch('addLocal/:id/:localId')
  addLocalUserToUser(
    @Param('id') id: number,
    @Param('localId') localId: number,
  ) {
    return this.userService.addLocalUserToUser(id, localId);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: User,
  ): Promise<string> {
    await this.userService.updateUser(id, user);
    return Object.assign({
      data: { ...user },
      statusCode: 200,
      statusMsg: `updated successfully`,
    });
  }

  @Post()
  async saveUser(@Body() user: User): Promise<User> {
    const savedUser = await this.userService.saveUser(user);
    return Object.assign({
      data: { savedUser },
      statusCode: 200,
      statusMsg: `saved successfully`,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<string> {
    await this.userService.deleteUser(+id);
    return Object.assign({
      data: { userId: id },
      statusCode: 200,
      statusMsg: `deleted successfully`,
    });
  }
}
