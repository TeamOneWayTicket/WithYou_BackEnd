import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class KakaoTokenDTO {
  @ApiProperty({ description: '유저 타입' })
  @IsString()
  access_token: string;

  @ApiProperty({ description: '유저 id' })
  @IsString()
  refresh_token: string;
}
