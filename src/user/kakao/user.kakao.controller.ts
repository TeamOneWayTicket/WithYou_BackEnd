import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LocalUser } from '../../entity/local.user.entity';
import { KakaoUserService } from './user.kakao.service';
import { KakaoUser } from '../../entity/kakao.user.entity';

@Controller('user/kakao')
export class KakaoUserController {
  constructor(private readonly kakaoUserService: KakaoUserService) {
    this.kakaoUserService = kakaoUserService;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<LocalUser> {
    const foundUser = await this.kakaoUserService.findOne(+id);
    return Object.assign({
      data: foundUser,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Post()
  async saveUser(@Body() kakaoUser: KakaoUser): Promise<KakaoUser> {
    const savedUser = await this.kakaoUserService.saveUser(kakaoUser);
    return Object.assign({
      data: { savedUser },
      statusCode: 200,
      statusMsg: `saved successfully`,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<string> {
    await this.kakaoUserService.deleteUser(+id);
    return Object.assign({
      data: { userId: id },
      statusCode: 200,
      statusMsg: `deleted successfully`,
    });
  }
}
