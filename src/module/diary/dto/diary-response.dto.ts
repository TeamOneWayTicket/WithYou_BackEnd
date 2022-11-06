import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../entity/diary.entity';
import { User } from '../../user/entity/user.entity';

export class DiaryResponseDto {
  @ApiProperty({ description: '일기' })
  diary: Diary;

  @ApiProperty({ description: '일기' })
  author: User;

  @ApiProperty({ description: '댓글 갯수' })
  commentCount: number;
}
