import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseDto {
  @ApiProperty({ description: '유저 id' })
  id: number;

  @ApiProperty({ description: 'jwtToken' })
  accessToken: string;

  @ApiProperty({ description: '새로운 유저인지 판별하는 값' })
  isNew: boolean;

  @ApiProperty({ description: '유저 타입' })
  vendor: string;

  @ApiProperty({ description: '유저 이름' })
  nickname: string;

  @ApiProperty({ description: '유저 프로필 사진' })
  thumbnail: number;
}
