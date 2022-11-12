import { ApiProperty } from '@nestjs/swagger';
import { LocalDateTime } from '@js-joda/core';

export class DiaryCommentResponseDto {
  @ApiProperty({ description: '작성자 이름' })
  author: string;

  @ApiProperty({ description: '작성자 프로필 사진' })
  thumbnail: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: 'createdAt' })
  createdAt: LocalDateTime;
}
