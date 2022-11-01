import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Matches } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ description: 'profile name' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: '역할' })
  @IsString()
  @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/)
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

  @IsBoolean()
  @ApiProperty({ description: '가족 생성 여부' })
  createFamily: boolean;
}
