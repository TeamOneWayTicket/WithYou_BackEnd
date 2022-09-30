import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../../decorator/http.decorator';
import { Role } from '../../../common/enum/role.enum';
import { DiaryCommentsDto } from '../dto/diary-comments.dto';
import { DiaryCommentService } from '../service/diary.comment.service';
import { UserParam } from '../../../decorator/user.decorator';
import { User } from '../../user/entity/user.entity';
import { DiaryComment } from '../entity/diary.comment.entity';
import { CreateDiaryCommentDto } from '../dto/create-diary-comment.dto';

@Controller('diary/comment')
@ApiTags('일기장 댓글 API')
export class DiaryCommentController {
  constructor(private readonly diaryCommentService: DiaryCommentService) {}

  @Get(':diaryId')
  @Auth(Role.User)
  @ApiOperation({
    summary: 'get Comments',
    description: '특정 id로 일기 댓글들 받아온다.',
  })
  async getComments(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<DiaryCommentsDto> {
    return await this.diaryCommentService.findAllComments(diaryId);
  }

  @Post()
  @Auth(Role.User)
  @ApiBody({ type: CreateDiaryCommentDto })
  @ApiOkResponse({ description: '성공', type: DiaryComment })
  @ApiOperation({
    summary: 'create Comment',
    description: '일기에 댓글를 생성한다.',
  })
  async createDiary(
    @UserParam() user: User,
    @Body() dto: CreateDiaryCommentDto,
  ): Promise<DiaryComment> {
    return await this.diaryCommentService.createComment(user.id, dto);
  }
}
