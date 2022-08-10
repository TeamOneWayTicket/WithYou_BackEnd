import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class KakaoTokenDTO {
  @ApiProperty({ description: 'access token' })
  @IsString()
  accessToken: string;
}
