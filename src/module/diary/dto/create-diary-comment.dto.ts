import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryCommentDto {
  @ApiProperty({ description: '가족 id', example: 'createComment test' })
  diaryId: number;

  @ApiProperty({ description: '댓글 내용', example: 'createComment test' })
  content: string;
}
