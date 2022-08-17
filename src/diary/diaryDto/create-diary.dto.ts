import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryDto {
  @ApiProperty({ description: '일기장 내용', example: 'createDiary test' })
  content: string;
}
