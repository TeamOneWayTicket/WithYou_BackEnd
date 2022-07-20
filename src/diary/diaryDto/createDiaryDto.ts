import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryDto {
  @ApiProperty({ description: '가족 id' })
  familyId: number;

  @ApiProperty({ description: '작성한 사람의 id', example: 5 })
  authorId: number;

  @ApiProperty({ description: '일기장 내용', example: 'createDiary test' })
  content: string;
}
