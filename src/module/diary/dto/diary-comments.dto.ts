import { ApiProperty } from '@nestjs/swagger';
import { DiaryComment } from '../entity/diary.comment.entity';

export class DiaryCommentsDto {
  @ApiProperty({ description: '댓글들' })
  comments: DiaryComment[];
}
