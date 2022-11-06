import { ApiProperty } from '@nestjs/swagger';

export class DiaryCommentResponseDto {
  @ApiProperty({ description: '작성자 이름' })
  author: string;

  @ApiProperty({ description: '내용' })
  content: string;
}
