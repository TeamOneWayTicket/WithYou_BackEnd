import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiaryDto {
  @ApiProperty({ description: '일기장 내용', example: 'updateDiary test' })
  content: string;
}
