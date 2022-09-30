import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateDiaryCommentDto {
  @ApiProperty({ description: '가족 id', example: 'createComment test' })
  @IsNumber()
  diaryId: number;

  @ApiProperty({ description: '댓글 내용', example: 'createComment test' })
  @IsString()
  content: string;
}
