import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtValidationDto {
  @ApiProperty({ description: '유저 타입' })
  vendor: string;

  @ApiProperty({ description: '유저 id' })
  id: number;

  @ApiProperty({ description: '유저 이름' })
  nickname: string;

  @ApiProperty({ description: '유저 프로필 사진' })
  thumbnail: string;

  @ApiProperty({ description: '새로운 유저인지 판별하는 값' })
  @IsString()
  isNew: boolean;
}
