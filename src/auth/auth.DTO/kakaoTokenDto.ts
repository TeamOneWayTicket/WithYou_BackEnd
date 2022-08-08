import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class KakaoTokenDTO {
  @ApiProperty({ description: 'access token' })
  @IsString()
  access_token: string;

  @ApiProperty({ description: 'refresh token' })
  @IsString()
  refresh_token: string;
}
