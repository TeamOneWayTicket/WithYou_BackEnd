import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseDto {
  @ApiProperty({ description: '유저 id' })
  id: number;

  @ApiProperty({ description: '사용자 역할' })
  role: string;

  @ApiProperty({ description: '유저 타입' })
  vendor: string;

  @ApiProperty({ description: '유저 이름' })
  nickname: string;

  @ApiProperty({ description: '유저 프로필 사진' })
  thumbnail: string;

  @ApiProperty({ description: '토큰 발급 시각' })
  iat: string;

  @ApiProperty({ description: '토큰 만료 시각' })
  exp: string;
}
