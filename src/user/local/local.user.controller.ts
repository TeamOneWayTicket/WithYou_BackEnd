import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LocalUserService } from './local.user.service';
import { LocalUser } from '../../entity/local.user.entity';

@Controller('user/local')
export class LocalUserController {
  constructor(private readonly localUserService: LocalUserService) {
    this.localUserService = localUserService;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<LocalUser> {
    const foundUser = await this.localUserService.findOne(+id);
    return Object.assign({
      data: foundUser,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Post()
  async saveUser(@Body() localUser: LocalUser): Promise<LocalUser> {
    const savedUser = await this.localUserService.saveUser(localUser);
    return Object.assign({
      data: { savedUser },
      statusCode: 200,
      statusMsg: `saved successfully`,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<string> {
    await this.localUserService.deleteUser(+id);
    return Object.assign({
      data: { userId: id },
      statusCode: 200,
      statusMsg: `deleted successfully`,
    });
  }
}
