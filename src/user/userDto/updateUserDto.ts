import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: '가족 id' })
  familyId: number;

  @ApiProperty({ description: '닉네임', example: 'updateUser test nickname' })
  nickname: string;

  @ApiProperty({ description: '성별', example: 'female' })
  gender: string;
}
