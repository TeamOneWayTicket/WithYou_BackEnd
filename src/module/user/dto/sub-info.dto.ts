import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubInfoDto {
  @ApiProperty({ description: '역할' })
  @IsString()
  role: string;

  @IsString()
  @ApiProperty({ description: '닉네임', example: 'updateUser test nickname' })
  nickname: string;

  @IsString()
  @ApiProperty({ description: '성별', example: 'female' })
  gender: string;
}
