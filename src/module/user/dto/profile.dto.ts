import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ description: 'profile name' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: '역할' })
  @IsString()
  role: string;

  @IsString()
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @IsString()
  @ApiProperty({ description: '성별' })
  gender: string;

  @IsString()
  @ApiProperty({ description: '가족 초대 코드' })
  code: string;
}
