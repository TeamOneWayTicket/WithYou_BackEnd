import { ApiProperty } from '@nestjs/swagger';

export class DiaryContentDto {
  @ApiProperty({ description: '일기장 내용', example: 'createDiary test' })
  content: string;
}
