import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '가족 id' })
  familyId: number;

  @ApiProperty({ description: '닉네임', example: 'createUser test nickname' })
  nickname: string;

  @ApiProperty({ description: '성별', example: 'male' })
  gender: string;
}
