import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiaryService } from '../service/diary.service';

@Controller('diary/comment')
@ApiTags('일기장 댓글 API')
export class DiaryCommentController {
  constructor(private readonly diaryService: DiaryService) {}
}
