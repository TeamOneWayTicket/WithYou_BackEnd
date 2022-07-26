import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'dev 홈페이지',
    description: '메뉴 역할',
  })
  devMenuPage(): string {
    return `
      <div>
        <h1>WithYou Dev Menu</h1>

        <form action="/auth/google/menu" method="GET">
          <input type="submit" value="구글 로그인 메뉴" />
        </form>
        <form action="/auth/kakao/menu" method="GET">
          <input type="submit" value="카카오 로그인 메뉴" />
        </form>
    `;
  }
}
