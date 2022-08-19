import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryDto {
  @ApiProperty({ description: '가족 id', example: 'createDiary test' })
  familyId: number;

  @ApiProperty({ description: '작성자 id', example: 'createDiary test' })
  authorId: number;

  @ApiProperty({ description: '일기장 내용', example: 'createDiary test' })
  content: string;
}
