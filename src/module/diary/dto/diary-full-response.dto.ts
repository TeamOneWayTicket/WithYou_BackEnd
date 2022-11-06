import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../entity/diary.entity';
import { User } from '../../user/entity/user.entity';
import { DiaryCommentResponseDto } from './diary-coment-response.dto';

export class DiaryFullResponseDto {
  @ApiProperty({ description: '일기' })
  diary: Diary;

  @ApiProperty({ description: '일기' })
  author: User;

  @ApiProperty({ description: '댓글들' })
  comments: DiaryCommentResponseDto[];

  @ApiProperty({ description: '댓글 갯수' })
  commentCount: number;
}
