import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtValidationDto {
  @ApiProperty({ description: '유저 타입' })
  userType: string;

  @ApiProperty({ description: '유저 id' })
  userId: number;

  @ApiProperty({ description: '유저 이름' })
  userName: string;

  @ApiProperty({ description: '유저 프로필 사진' })
  userProfile: number;

  @ApiProperty({ description: '새로운 유저인지 판별하는 값' })
  @IsString()
  isNew: boolean;
}
