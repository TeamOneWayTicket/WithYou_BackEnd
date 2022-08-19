import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseDto {
  @ApiProperty({ description: 'jwtToken' })
  accessToken: string;

  @ApiProperty({ description: '새로운 유저인지 판별하는 값' })
  isNew: boolean;

  @ApiProperty({ description: '유저 타입' })
  userType: string;

  @ApiProperty({ description: '유저 id' })
  userId: number;

  @ApiProperty({ description: '유저 이름' })
  userName: string;

  @ApiProperty({ description: '유저 프로필 사진' })
  userProfile: number;
}
