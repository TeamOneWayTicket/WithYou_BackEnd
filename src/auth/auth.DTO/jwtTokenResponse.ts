import { ApiProperty } from '@nestjs/swagger';

export class JwtTokenResponse {
  @ApiProperty({ description: '유저 타입' })
  userType: string;

  @ApiProperty({ description: '유저 id' })
  userId: number;

  @ApiProperty({ description: '토큰 발급 시각' })
  iat: string;

  @ApiProperty({ description: '토큰 만료 시각' })
  exp: string;
}
