import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseDto {
  @ApiProperty({ description: '유저 타입' })
  userType: string;

  @ApiProperty({ description: '유저 id' })
  userId: number;

  @ApiProperty({ description: '유저 이름' })
  userName: string;

  @ApiProperty({ description: '유저 프로필 사진' })
  userProfile: number;

  @ApiProperty({ description: '토큰 발급 시각' })
  iat: string;

  @ApiProperty({ description: '토큰 만료 시각' })
  exp: string;
}
